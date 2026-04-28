import { formatTime } from "../game";

type Props = { moves: number; elapsedMs: number; onNewGame: () => void };

export function WinPanel({ moves, elapsedMs, onNewGame }: Props) {
  return (
    <div className="win-panel" role="dialog" aria-label="You won" data-testid="win-panel">
      <h2>You cleared the board.</h2>
      <div className="win-stats">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(elapsedMs)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>
      <button className="btn-primary" onClick={onNewGame}>New Game</button>
    </div>
  );
}
