import type { Card as CardT } from "../types";

type Props = { card: CardT; onFlip: (id: number) => void; disabled: boolean };

export function Card({ card, onFlip, disabled }: Props) {
  const cls = ["card"];
  if (card.faceUp) cls.push("faceup");
  if (card.matched) cls.push("matched");
  const showFront = card.faceUp || card.matched;
  return (
    <button
      type="button"
      className={cls.join(" ")}
      onClick={() => onFlip(card.id)}
      disabled={disabled || card.faceUp || card.matched}
      aria-label={showFront ? `${card.label} card, face up` : "Face-down card"}
      data-testid={`card-${card.id}`}
      data-pair={card.pairKey}
      data-faceup={showFront ? "true" : "false"}
    >
      <div className="card-inner">
        <div className="card-face card-back" aria-hidden="true">?</div>
        <div className="card-face card-front">
          <div className="card-emoji">{card.emoji}</div>
          <div className="card-label">{card.label}</div>
        </div>
      </div>
    </button>
  );
}
