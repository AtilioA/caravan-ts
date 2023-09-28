export interface ICard {
  value: string;
  suit: string;
  faceCards: ICard[]; // to store face cards stacked to this card

  addFaceCard(card: ICard): void;
  computeValue(): number;
}
