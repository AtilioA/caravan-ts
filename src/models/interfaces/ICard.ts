import { CardValues } from "../../constants/cardConstants";

export interface ICard {
  value: CardValues;
  suit: string;
  // Theme is location featuring on the back (can be Ultra-Luxe, Lucky 38, etc.)
  theme: string;
  attachedCards: ICard[]; // to store face cards stacked to this card

  isFaceCard(): boolean;
  attachFaceCard(card: ICard): void;
  computeValue(): number;
}
