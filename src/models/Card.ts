import { SUITS, VALUES } from '../constants/cardConstants';
import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  constructor(public value: string, public suit: string) {
    // Check if the value and suit are valid
    if (!VALUES.includes(value) || !SUITS.includes(suit)) {
      throw new Error('Invalid card value or suit.');
    }
  }
}
