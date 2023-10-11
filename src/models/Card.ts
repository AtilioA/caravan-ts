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

  attachFaceCard(card: ICard): boolean {
    // Queens are not attached, but added to the bottom of the caravan instead
    if (card.isFaceCard() && card.value !== 'Queen') {
      this.attachedCards.push(card);
      return true;
    }
    else {
      throw new InvalidPlayError('Cannot attach a Queen or any non-face card to another card');
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
