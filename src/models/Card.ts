import { CardValues, SUITS, THEMES, VALUES } from '../constants/cardConstants';
import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  constructor(public value: CardValues, public suit: string, public theme: string = "Default", public faceCards: ICard[] = []) {
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

  addFaceCard(card: ICard): void {
    this.faceCards.push(card);
  }

  computeValue(): number {
    const nKingsAttached = this.faceCards.filter((card) => card.value === 'King').length;
    if (nKingsAttached > 0) {
      // FIXME: Handle 'ace' value afterwards (use enum)
      return Number(this.value) * Math.pow(2, nKingsAttached);
    } else {
      return Number(this.value)
    }
  }
}
