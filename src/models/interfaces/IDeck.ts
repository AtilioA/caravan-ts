import { ICard } from "./ICard";

/**
 * Represents a deck of cards. Provides methods for managing the cards
 * in the deck such as adding, drawing, shuffling, and generating cards.
 */
export interface IDeck {

  /**
   * The array of cards present in the deck.
   */
  cards: ICard[];

  /**
   * Gets the current size (number of cards) of the deck.
   * @returns The number of cards in the deck.
   */
  getSize(): number;

  /**
   * Adds a card to the deck. The card will only be added if it's unique
   * (based on suit, value, and theme), according to Caravan rules.
   * @param card - The card to add to the deck.
   */
  addCard(card: ICard): void;

  /**
   * Adds multiple cards to the deck.
   * @param cards - An array of cards to add to the deck.
   */
  addCards(cards: ICard[]): void;

  /**
   * Generates a specified quantity of unique cards and adds them to the deck.
   * Cards are generated based on random values, suits, and themes.
   * @param quantity - The number of cards to generate.
   */
  generate(quantity: number): void;

  /**
   * Shuffles the cards in the deck using the Fisher-Yates algorithm.
   */
  shuffle(): void;

  /**
   * Draws a card from the top of the deck and removes it.
   * @returns The card drawn from the deck.
   * @throws {InvalidPlayError} If the deck is empty.
   */
  drawCard(): ICard;
}
