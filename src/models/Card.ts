import { CardSuit, CardTheme, CardValue, SUITS, THEMES, VALUES, ValueMapping } from '../constants/cardConstants';
import { InvalidPlayError } from '../exceptions/GameExceptions';
import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  value: CardValue;
  suit: CardSuit;
  theme: CardTheme = "Default";
  attachedCards: ICard[] = [];

  constructor(value: CardValue, suit: CardSuit, theme: CardTheme = "Default", attachedCards: ICard[] = []) {
    this.value = value;
    this.suit = suit;
    this.theme = theme;
    this.attachedCards = attachedCards;
  }

  // Subclassing would probably be overkill (alternative would be using a Factory)
  isFaceCard(): boolean {
    return ['Jack', 'Queen', 'King', 'Joker'].includes(this.value);
  }

  canAttachFaceCard(card: ICard): boolean {
    if (this.attachedCards.length === 3) {
      // A card can only have 3 face cards attached to it, at most (not even a Jack is allowed in order to remove them; caravan must be disbanded)
      return false;
    } else if (card.isFaceCard()) {
      if (card.value === 'Queen') {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  attachFaceCard(card: ICard): boolean {
    if (this.canAttachFaceCard(card)) {
      this.attachedCards.push(card);
      return true;
    }
    else {
      throw new InvalidPlayError('Cannot attach this face card to this card; card is already full or attaching card is a Queen');
    }
  }

  getNumericValue(): number {
    return ValueMapping[this.value];
  }

  computeValue(): number {
    const nKingsAttached = this.attachedCards.filter((card) => card.value === 'King').length;
    if (nKingsAttached > 0) {
      return Number(this.getNumericValue()) * Math.pow(2, nKingsAttached);
    } else {
      return Number(this.getNumericValue())
    }
  }
}
