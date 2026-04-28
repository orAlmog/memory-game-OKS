import type { Card as CardT } from "../types";
import { Card } from "./Card";

type Props = { cards: CardT[]; locked: boolean; onFlip: (id: number) => void };

export function Board({ cards, locked, onFlip }: Props) {
  return (
    <div className={"board" + (locked ? " locked" : "")} role="grid" aria-label="Memory board" data-testid="board">
      {cards.map((c) => (
        <Card key={c.id} card={c} onFlip={onFlip} disabled={locked} />
      ))}
    </div>
  );
}
