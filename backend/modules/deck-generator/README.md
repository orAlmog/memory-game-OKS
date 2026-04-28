# deck-generator

Backend module that turns a free-text theme into 8 emoji+label pairs via Claude.

## Endpoint

`POST /api/generate-deck`

Request: `{ "theme": "Renaissance painters" }`

Response: `{ "deck": CardPair[8], "fallback": boolean, "reason"?: string }`

`CardPair = { emoji: string, label: string }`

Always returns HTTP 200. On any failure (empty theme, timeout, API error, parse error, no API key), returns the built-in default deck with `fallback: true`.

## Run

```
npm install
ANTHROPIC_API_KEY=sk-... npm run dev
```

Listens on `:3001`. Reads `.env` from the module dir or repo root.
