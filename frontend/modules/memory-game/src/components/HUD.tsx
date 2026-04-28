import { useEffect, useState } from "react";
import { formatTime } from "../game";

type Props = {
  moves: number;
  startedAt: number | null;
  frozenElapsedMs: number | null;
  onNewGame: () => void;
};

export function HUD({ moves, startedAt, frozenElapsedMs, onNewGame }: Props) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (startedAt === null || frozenElapsedMs !== null) return;
    const id = window.setInterval(() => tick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [startedAt, frozenElapsedMs]);

  const elapsed = frozenElapsedMs ?? (startedAt === null ? 0 : Date.now() - startedAt);

  return (
    <div className="hud">
      <div className="stat">
        <span className="stat-label">Time</span>
        <span className="stat-value" data-testid="timer">{formatTime(elapsed)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Moves</span>
        <span className="stat-value" data-testid="moves">{moves}</span>
      </div>
      <button className="btn-secondary" onClick={onNewGame} data-testid="new-game">New Game</button>
    </div>
  );
}
