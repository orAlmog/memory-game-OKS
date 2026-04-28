import type { Card, CardPair } from "./types";

export function buildBoard(deck: CardPair[]): Card[] {
  const cards: Card[] = [];
  deck.forEach((p, i) => {
    const key = `${i}-${p.label}`;
    cards.push({ id: i * 2, pairKey: key, emoji: p.emoji, label: p.label, faceUp: false, matched: false });
    cards.push({ id: i * 2 + 1, pairKey: key, emoji: p.emoji, label: p.label, faceUp: false, matched: false });
  });
  return shuffle(cards);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
