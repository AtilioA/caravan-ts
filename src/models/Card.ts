import { SUITS, VALUES } from '../constants/cardConstants';
import { Values } from '../enums/cards';
import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  constructor(public value: string, public suit: string, public faceCards: ICard[] = []) {
    // Check if the value and suit are valid
    if (!VALUES.includes(value) || !SUITS.includes(suit)) {
      throw new Error('Invalid card value or suit.');
    }
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
