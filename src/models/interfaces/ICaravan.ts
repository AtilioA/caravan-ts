import { CardSuit } from "../../constants/cardConstants";
import { Direction } from "../../enums/directions";
import { ICard } from "./ICard";

/**
 * Defines the structure and functionality of a Caravan.
 */
export interface ICaravan {
  /** A list of cards that are in the caravan. */
  cards: ICard[];
  /** The current direction of the caravan. */
  direction: Direction | null;
  /** The current suit of the caravan. */
  suit: CardSuit | null;
  /** The current bid of the caravan. */
  bid: number;

  /**
   * Checks if the caravan is empty.
   * @returns true if the caravan is empty, otherwise false.
   */
  isEmpty(): boolean;

  /**
   * Retrieves the last valued card in the caravan.
   * @returns the last valued card.
   */
  getLastValuedCard(): ICard;

  /**
   * Adds a card to the caravan.
   * @param card - The card to be added.
   */
  addCard(card: ICard): void;

  /**
   * Determines if a card can be added to the caravan.
   * @param card - The card to be checked.
   * @returns true if the card can be added, otherwise false.
   */
  canAddCard(card: ICard): boolean;

  /**
   * Computes the total value of the caravan.
   * @returns the total value.
   */
  computeValue(): number;

  /**
   * Checks if the caravan is sold.
   * @returns true if the bid is between 21 and 26, otherwise false.
   */
  isSold(): boolean;

  /**
   * Disbands the caravan and returns its cards.
   * @returns a list of cards from the disbanded caravan.
   */
  disband(): ICard[];
}
