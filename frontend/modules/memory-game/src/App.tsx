import { useState } from "react";
import type { CardPair } from "./types";
import { DEFAULT_DECK } from "./defaultDeck";
import { useGame } from "./useGame";
import { Board } from "./components/Board";
import { HUD } from "./components/HUD";
import { WinPanel } from "./components/WinPanel";
import { IdleScreen } from "./components/IdleScreen";

type Phase = "idle" | "playing";

export function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deck, setDeck] = useState<CardPair[]>(DEFAULT_DECK);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const game = useGame(deck);

  const startWithDeck = (next: CardPair[], bannerMsg: string | null) => {
    setDeck(next);
    setBanner(bannerMsg);
    setPhase("playing");
  };

  const generate = async (theme: string) => {
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      const data = await res.json();
      if (Array.isArray(data?.deck) && data.deck.length === 8) {
        startWithDeck(
          data.deck,
          data.fallback ? "Couldn't generate a custom deck — playing with the default." : null,
        );
      } else {
        startWithDeck(DEFAULT_DECK, "Unexpected response — playing with the default deck.");
      }
    } catch {
      startWithDeck(DEFAULT_DECK, "Network error — playing with the default deck.");
    } finally {
      setLoading(false);
    }
  };

  const newGame = () => {
    setPhase("idle");
    game.reset(DEFAULT_DECK);
  };

  if (phase === "idle") {
    return (
      <div className="app">
        <IdleScreen
          onGenerate={generate}
          onUseDefault={() => startWithDeck(DEFAULT_DECK, null)}
          loading={loading}
          bannerMessage={banner}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {banner && <div className="banner" data-testid="banner">{banner}</div>}
      <HUD
        moves={game.moves}
        startedAt={game.startedAt}
        frozenElapsedMs={game.won ? game.elapsedMs : null}
        onNewGame={newGame}
      />
      <Board cards={game.cards} locked={game.locked} onFlip={game.flip} />
      {game.won && <WinPanel moves={game.moves} elapsedMs={game.elapsedMs} onNewGame={newGame} />}
    </div>
  );
}
