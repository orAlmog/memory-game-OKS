import Anthropic from "@anthropic-ai/sdk";
import { DEFAULT_DECK, type CardPair } from "./defaultDeck.js";

const TIMEOUT_MS = 10_000;
const MODEL = "claude-3-5-sonnet-latest";

const SYSTEM_PROMPT = `You generate themed card decks for a memory matching game.
Return exactly 8 unique pairs as JSON. Each item: { "emoji": string, "label": string }.
Constraints:
- emoji: a single emoji glyph that visually represents the label.
- label: 1-2 words, capitalized.
- All 8 must be unique.
Return ONLY a JSON array of 8 objects. No prose, no markdown.`;

function validateDeck(parsed: unknown): CardPair[] | null {
  if (!Array.isArray(parsed) || parsed.length !== 8) return null;
  const seen = new Set<string>();
  const deck: CardPair[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") return null;
    const { emoji, label } = item as Record<string, unknown>;
    if (typeof emoji !== "string" || typeof label !== "string") return null;
    if (!emoji.trim() || !label.trim()) return null;
    const key = emoji.trim() + "|" + label.trim().toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    deck.push({ emoji: emoji.trim(), label: label.trim() });
  }
  return deck;
}

export type DeckResult = {
  deck: CardPair[];
  fallback: boolean;
  reason?: string;
};

export async function generateDeck(theme: string, apiKey: string | undefined): Promise<DeckResult> {
  if (!apiKey) {
    return { deck: DEFAULT_DECK, fallback: true, reason: "No API key configured" };
  }

  const client = new Anthropic({ apiKey });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const msg = await client.messages.create(
      {
        model: MODEL,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Theme: ${theme}` }],
      },
      { signal: controller.signal },
    );

    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return { deck: DEFAULT_DECK, fallback: true, reason: "No JSON in response" };
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const deck = validateDeck(parsed);
    if (!deck) {
      return { deck: DEFAULT_DECK, fallback: true, reason: "Invalid deck shape" };
    }
    return { deck, fallback: false };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown error";
    return { deck: DEFAULT_DECK, fallback: true, reason };
  } finally {
    clearTimeout(timer);
  }
}
