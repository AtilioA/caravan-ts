import { CardSuit, CardTheme, CardValue } from "../../constants/cardConstants";

export interface ICard {
  value: CardValue;
  suit: CardSuit;
  // Theme is location featuring on the back (can be Ultra-Luxe, Lucky 38, etc.)
  theme: CardTheme;
  attachedCards: ICard[]; // to store face cards stacked to this card

  isFaceCard(): boolean;
  canAttachFaceCard(card: ICard): boolean;
  attachFaceCard(card: ICard): boolean;

  getNumericValue(): number;
  computeValue(): number;
}
