import { CardSuit, CardValue, ValueMapping } from "../constants/cardConstants";
import { Direction } from "../enums/directions";
import { InvalidPlayError } from "../exceptions/GameExceptions";
import { EventBus } from "./EventBus";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";

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

    const eventBus = EventBus.getInstance();
    eventBus.subscribe("playJokerOnNumber", this.handleJokerOnNumber.bind(this));
    eventBus.subscribe("playJokerOnAce", this.handleJokerOnAce.bind(this));
    eventBus.subscribe("playJack", this._jackLogic.bind(this));
  }

  private handleJokerOnNumber({ card, targetCard, targetCaravan }: { card: ICard; targetCard: ICard, targetCaravan: ICaravan }): void {
    if (card.value !== "Joker") {
      // istanbul ignore next
      throw new Error("handleJokerOnNumber should only be called when the card is a Joker.");
    }
    if (targetCard.value === "Ace") {
      // istanbul ignore next
      throw new Error("handleJokerOnNumber should only be called when the target card is not an ace.");
    }

    if (targetCaravan === this) {
      // Attach the Joker to the target Ace.
      targetCard.attachedCards.push(card);
    }

    // Remove all other cards with the same value as the target card, excluding the target itself.
    this.cards = this.cards.filter(card => card === targetCard || (card.value !== targetCard.value || card.isFaceCard()));

  }

  private handleJokerOnAce({ card, targetCard, targetCaravan }: { card: ICard; targetCard: ICard, targetCaravan: ICaravan }): void {
    if (card.value !== "Joker") {
      // istanbul ignore next
      throw new Error("handleJokerOnNumber should only be called when the card is a Joker.");
    }
    if (targetCard.value !== "Ace") {
      // istanbul ignore next
      throw new Error("handleJokerOnAce should only be called when the target card is an Ace.");
    }

    if (targetCaravan === this) {
      // Attach the Joker to the target Ace.
      targetCard.attachedCards.push(card);
    }

    // Remove all cards with the same suit as the Ace, excluding the Ace and any face cards.
    this.cards = this.cards.filter(card => card === targetCard || (card.suit !== targetCard.suit || card.isFaceCard()));
  }

  private _isValueInDirection(value: CardValue): boolean {
    // Don't allow face cards to be considered for the direction (e.g: when using a Queen to change the direction of the caravan)
    const lastCardValue = this.getLastValuedCard().getNumericValue();

    switch (this.direction) {
    case Direction.ASCENDING:
      return ValueMapping[value] > lastCardValue;
    case Direction.DESCENDING:
      return ValueMapping[value] < lastCardValue;
      /* istanbul ignore next */
    default:
      // NOTE: throw an error since the direction should always be defined at this point?
      return false;
    }
  }

  private _jackLogic(target: ICard, jackCard: ICard): void {
    console.log("Jack played on caravan", target, jackCard);
    // Removes the card the Jack is played on as well as any face cards/Jokers attached, to the discard pile.
  }

  getLastValuedCard(): ICard {
    const filteredCards = this.cards.filter(card => !card.isFaceCard());
    return filteredCards[filteredCards.length - 1];
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }


  // private _kingLogic(target: ICard, kingCard: ICard): void {
  //   // Doubles the value of the card the king is played on. Stacks with other kings, e.g.: 2 kings on a 5 = 20.
  //   // Add to the bid the value of the card the king is played on.
  //   // this.bid += target.computeValue();
  // }

  private _queenLogic(queenCard: ICard): void {
    // Changes the suit of the caravan to the suit of the Queen and reverses the direction of the caravan.
    this.suit = queenCard.suit;
    this.direction = this.direction === Direction.ASCENDING ? Direction.DESCENDING : Direction.ASCENDING;
  }

  canAddCard(card: ICard): boolean {
    // If the caravan is empty and the card is a face card, return false.
    if (this.cards.length === 0) {
      if (card.isFaceCard()) {
        return false;
      } else {
        return true;
      }
    } else if (this.getLastValuedCard().getNumericValue() === card.getNumericValue()) {
      // Do not allow equal card values to be added to the caravan.
      return false;
    }

    // If caravan is not empty, it is valid to add a face card.
    if (card.isFaceCard()) {
      return true;
    }

    // If the caravan has a defined suit and the card's suit matches the caravan's suit, return true.
    if (this.suit && this.suit === card.suit) {
      return true;
    }

    if (this.direction !== null) {
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

    // REFACTOR: This is a bit messy, but it works for now.
    // Set or validate the direction with the second card.
    if (!card.isFaceCard() && this.cards.length === 1) {
      const lastCardValue = this.cards[0].getNumericValue();
      if (card.getNumericValue() > lastCardValue) {
        this.direction = Direction.ASCENDING;
      } else if (card.getNumericValue() < lastCardValue) {
        this.direction = Direction.DESCENDING;
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
      }
      */
      // Change suit and nullify direction for Queen.
      if (card.value === "Queen") {
        this._queenLogic(card,);
      }
      // this.bid = this.computeValue();
    }

    // Finally, add the card to the caravan.
    this.cards.push(card);
  }

  // Might not be needed (we'd just change the bid when cards are played)
  computeValue(): number {
    // Compute the value of the caravan. Iterate over the cards and add the computeValue result of each card.
    return this.cards.reduce((total, card) => total + card.computeValue(), 0);
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
