export type CardPair = { emoji: string; label: string };

export type Card = {
  id: number;
  pairKey: string;
  emoji: string;
  label: string;
  faceUp: boolean;
  matched: boolean;
};

export type GameStatus = "idle" | "generating" | "playing" | "won" | "error";
