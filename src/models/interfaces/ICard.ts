import { CardSuit, CardValue } from "../../constants/cardConstants";

export interface ICard {
  value: CardValue;
  suit: CardSuit;
  // Theme is location featuring on the back (can be Ultra-Luxe, Lucky 38, etc.)
  // TODO: replace with a theme type
  theme: string;
  attachedCards: ICard[]; // to store face cards stacked to this card

  isFaceCard(): boolean;
  attachFaceCard(card: ICard): void;
  computeValue(): number;
}
