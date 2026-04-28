import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateDeck } from "./generateDeck.js";
import { DEFAULT_DECK } from "./defaultDeck.js";

const PORT = Number(process.env.PORT) || 3001;
const MAX_THEME_LEN = 80;

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-deck", async (req, res) => {
  const theme = typeof req.body?.theme === "string" ? req.body.theme.trim() : "";
  if (!theme) {
    return res.json({ deck: DEFAULT_DECK, fallback: true, reason: "Empty theme" });
  }
  if (theme.length > MAX_THEME_LEN) {
    return res.json({ deck: DEFAULT_DECK, fallback: true, reason: "Theme too long" });
  }
  const result = await generateDeck(theme, process.env.ANTHROPIC_API_KEY);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`[deck-generator] listening on http://localhost:${PORT}`);
});
