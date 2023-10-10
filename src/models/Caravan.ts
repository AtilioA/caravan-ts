import { CardSuit, CardValue, ValueMapping } from '../constants/cardConstants';
import { Direction } from '../enums/directions';
import { InvalidPlayError } from '../exceptions/GameExceptions';
import { ICaravan } from './interfaces/ICaravan';
import { ICard } from './interfaces/ICard';

export class Caravan implements ICaravan {
  cards: ICard[] = [];
  direction: Direction | null = null;
  suit: CardSuit | null = null;
  bid: number = 0;

  constructor(cards: ICard[] = [], direction: Direction | null = null, suit: CardSuit | null = null, bid: number = 0) {
    this.cards = cards;
    this.direction = direction;
    this.suit = suit;
    this.bid = bid;
  }

  private _isValueInDirection(value: CardValue): boolean {
    const lastCardValue = this.cards[this.cards.length - 1].getNumericValue();

    switch (this.direction) {
      case Direction.ASCENDING:
        return ValueMapping[value] > lastCardValue;
      case Direction.DESCENDING:
        return ValueMapping[value] < lastCardValue;
      default:
        // NOTE: throw an error since the direction should always be defined at this point?
        return false;
    }
  }

  canAddCard(card: ICard): boolean {
    // If the caravan is empty and the card is a face card, return false.
    if (this.cards.length === 0) {
      if (card.isFaceCard()) {
        return false;
      } else {
        return true;
      }
    }

    if (card.isFaceCard()) {
      return true;
    }

    // If the caravan has a defined suit and the card's suit matches the caravan's suit, return true.
    if (this?.suit === card.suit && (this.cards[this.cards.length - 1].getNumericValue() !== card.getNumericValue())) {
        return true;
    }

    if (this.direction) { // Check if there is a defined direction
      return this._isValueInDirection(card.value);
    }
    return true;
  }

  addCard(card: ICard): void {
    if (!this.canAddCard(card)) {
      throw new InvalidPlayError("Cannot add this card to the caravan.");
    }
    // For the first card, set the suit of the Caravan.
    if (this.cards.length === 0) {
      this.suit = card.suit;
    }

    // Set or validate the direction with the second card.
    if (this.cards.length === 1) {
      const lastCardValue = this.cards[0].getNumericValue();
      if (card.getNumericValue() > lastCardValue) {
        this.direction = Direction.ASCENDING;
      } else if (card.getNumericValue() < lastCardValue) {
        this.direction = Direction.DESCENDING;
      } else {
        throw new InvalidPlayError("Equal card values are not allowed.");
      }
    }

    // Change the suit when a card of a different suit is added.
    if (card.suit !== this.suit) {
      this.suit = card.suit;
    }

    // Update bid for non-face cards.
    if (!card.isFaceCard()) {
      this.bid += card.getNumericValue();
    } else {
      // Because of Joker, we might need to handle this within the game logic (we need to view every other caravan in order to determine the outcome of playing a Joker).
      /*
      if (card.value === 'King') {
        this.bid += ValueMapping[this.cards[this.cards.length - 1].value];
      } else if (card.value === 'Jack') {
        // Remove all cards of the same suit and recalculate the bid.
        this.cards = this.cards.filter(c => c.suit !== card.suit);
        this.bid = this.cards.reduce((acc, c) => acc + ValueMapping[c.value], 0);
      }
      */
      // Change suit and nullify direction for Queen.
      if (card.value === 'Queen') {
        this.suit = card.suit;
        this.direction = this.direction === Direction.ASCENDING ? Direction.DESCENDING : Direction.ASCENDING;
      }
    }

    // Finally, add the card to the caravan.
    this.cards.push(card);
  }

  // Might not be needed (we'd just change the bid when cards are played)
  computeValue(): number {
    // implementation here
    throw new Error("Method not implemented.");
  }

  isSold(): boolean {
    return this.bid >= 21 && this.bid <= 26;
  }

  // Return the cards in the caravan and reset the caravan.
  disband(): ICard[] {
    const cards = this.cards;

    this.cards = [];
    this.direction = null;
    this.suit = null;
    this.bid = 0;

    return cards;
  }
}
