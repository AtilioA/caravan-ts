export interface ICard {
  value: string;
  suit: string;
  // Theme is location featuring on the back (can be Ultra-Luxe, Lucky 38, etc.)
  theme: string;
  faceCards: ICard[]; // to store face cards stacked to this card

  addFaceCard(card: ICard): void;
  computeValue(): number;
}
