import { useCallback, useEffect, useRef, useState } from "react";
import type { Card, CardPair } from "./types";
import { buildBoard } from "./game";

const FLIP_BACK_MS = 1000;

export function useGame(deck: CardPair[]) {
  const [cards, setCards] = useState<Card[]>(() => buildBoard(deck));
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const flipBackTimer = useRef<number | null>(null);

  const reset = useCallback((nextDeck?: CardPair[]) => {
    if (flipBackTimer.current) window.clearTimeout(flipBackTimer.current);
    setCards(buildBoard(nextDeck ?? deck));
    setMoves(0);
    setStartedAt(null);
    setEndedAt(null);
    setLocked(false);
  }, [deck]);

  // Reset when deck reference changes.
  useEffect(() => { reset(deck); /* eslint-disable-next-line */ }, [deck]);

  const won = cards.length > 0 && cards.every((c) => c.matched);
  useEffect(() => {
    if (won && endedAt === null) setEndedAt(Date.now());
  }, [won, endedAt]);

  const flip = useCallback((id: number) => {
    if (locked) return;
    setCards((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target || target.faceUp || target.matched) return prev;
      const faceUp = prev.filter((c) => c.faceUp && !c.matched);
      if (faceUp.length >= 2) return prev;

      const next = prev.map((c) => (c.id === id ? { ...c, faceUp: true } : c));
      const nowFaceUp = next.filter((c) => c.faceUp && !c.matched);

      if (nowFaceUp.length === 2) {
        const [a, b] = nowFaceUp;
        setMoves((m) => m + 1);
        if (a.pairKey === b.pairKey) {
          return next.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c));
        }
        setLocked(true);
        flipBackTimer.current = window.setTimeout(() => {
          setCards((cur) => cur.map((c) => (c.matched ? c : { ...c, faceUp: false })));
          setLocked(false);
        }, FLIP_BACK_MS);
      }
      return next;
    });
    setStartedAt((s) => s ?? Date.now());
  }, [locked]);

  useEffect(() => () => {
    if (flipBackTimer.current) window.clearTimeout(flipBackTimer.current);
  }, []);

  const elapsedMs = startedAt === null ? 0 : (endedAt ?? Date.now()) - startedAt;

  return { cards, moves, elapsedMs, locked, won, flip, reset, startedAt };
}
