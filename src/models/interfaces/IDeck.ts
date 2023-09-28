import { ICard } from "./ICard";

export interface IDeck {
  cards: ICard[];

  addCard(card: ICard): void;
  generate(quantity: number): void;

  shuffle(): void;

  drawCard(): ICard;
}
