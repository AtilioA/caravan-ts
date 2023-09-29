import { CardSuit, CardValue, SUITS, THEMES, VALUES } from '../constants/cardConstants';
import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  constructor(public value: CardValue, public suit: CardSuit, public theme: string = "Default", public attachedCards: ICard[] = []) {
    // Check if the value and suit are valid
    if (!VALUES.includes(value) || !SUITS.includes(suit)) {
      throw new Error('Invalid card value or suit. Must be one of the following: ' + VALUES.join(', ') + ' and ' + SUITS.join(', '));
    }
    // Check if the theme is valid
    if (!THEMES.includes(this.theme)) {
      throw new Error('Invalid card theme. Must be one of the following: ' + THEMES.join(', '));
    }
  }

  // Subclassing would probably be overkill (alternative would be using a Factory)
  isFaceCard(): boolean {
    return ['Jack', 'Queen', 'King', 'Joker'].includes(this.value);
  }

  attachFaceCard(card: ICard): void {
    // Queens are not attached, but added to the bottom of the caravan instead
    if (card.isFaceCard() && card.value !== 'Queen') {
      this.attachedCards.push(card);
    }
  }

  computeValue(): number {
    const nKingsAttached = this.attachedCards.filter((card) => card.value === 'King').length;
    if (nKingsAttached > 0) {
      // FIXME: Handle 'ace' value afterwards (use enum)
      return Number(this.value) * Math.pow(2, nKingsAttached);
    } else {
      return Number(this.value)
    }
  }
}
