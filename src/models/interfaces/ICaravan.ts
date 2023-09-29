import { CardSuit } from "../../constants/cardConstants";
import { Direction } from "../../enums/directions";
import { ICard } from "./ICard";

export interface ICaravan {
  cards: ICard[];
  direction: Direction | null;
  suit: CardSuit | null;
  bid: number;

  addCard(card: ICard): void;
  canAddCard(card: ICard): boolean;

  // Might not be needed (we'd just change the bid when cards are played)
  computeValue(): number;

  disband(): ICard[];
}
