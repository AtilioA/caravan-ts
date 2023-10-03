import { CardSuit, CardTheme, CardValue } from "../../constants/cardConstants";

export interface ICard {
  value: CardValue;
  suit: CardSuit;
  // Theme is location featuring on the back (can be Ultra-Luxe, Lucky 38, etc.)
  // TODO: replace with a theme type
  theme: CardTheme;
  attachedCards: ICard[]; // to store face cards stacked to this card

  isFaceCard(): boolean;
  attachFaceCard(card: ICard): boolean;
  computeValue(): number;
}
