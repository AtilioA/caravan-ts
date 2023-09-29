import { EnumSuits } from "../../enums/cards";
import { Direction } from "../../enums/directions";
import { ICard } from "./ICard";

export interface ICaravan {
  // TODO: change to EnumSuits
  cards: ICard[];
  direction: Direction | null;
  suit: string | null;
  bid: number;

  addCard(card: ICard): void;
  canAddCard(card: ICard): boolean;

  // Might not be needed (we'd just change the bid when cards are played)
  computeValue(): number;

  disband(): ICard[];
}
