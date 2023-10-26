import { CardSuit, CardTheme, CardValue } from "../../constants/cardConstants";

/**
 * Represents a card in the Caravan game. Provides methods for managing the card, such as checking if it's a face card, if a face card can be attached to it, and getting its _numeric_ value.
 */
export interface ICard {
  /** The value of the card (e.g. Ace, Two, ...). */
  value: CardValue;
  /** The suit of the card (e.g. Hearts, Diamonds, ...). */
  suit: CardSuit;
  /** The theme of the card. It is the 'location' featuring on the back (can be Ultra-Luxe, Lucky 38, etc.) */
  theme: CardTheme;
  /** Array of cards attached to this card. */
  attachedCards: ICard[]; // to store face cards stacked to this card

  /**
   * Checks if the card is a face card (Jack, Queen, King, Joker).
   * @returns true if it's a face card, false otherwise.
   */
  isFaceCard(): boolean;

  /**
   * Checks if a face card can be attached to this card.
   * A card can only have 3 face cards attached to it, at most.
   * Not even a Jack is allowed in order to remove the attached cards; to do so, the {@link models/interfaces/ICaravan} must be disbanded.
   * @param card - The card to check.
   * @returns true if the card can be attached, false otherwise.
   */
  canAttachFaceCard(card: ICard): boolean;

  /**
   * Attaches a face card to this card.
   * @param card - The face card to attach.
   * @returns true if the card was attached successfully.
   * @throws InvalidPlayError if the card cannot be attached.
   */
  attachFaceCard(card: ICard): boolean;

  /**
   * Gets the numeric value of the card based on its face value.
   * For example, the numeric value of an Ace is 1.
   * @see {@link constants/cardConstants}
   * @returns The numeric value of the card.
   */
  getNumericValue(): number;

  /**
   * Computes the total value of the card, considering any attached face cards.
   * @returns The computed value of the card.
   */
  computeValue(): number;
}
