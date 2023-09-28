import { SUITS, VALUES } from "../constants/cardConstants";
import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";

export class Deck implements IDeck {
  constructor(public cards: ICard[] = []) {}

  private isCardUnique(suit: string, value: string): boolean {
    // Check if the card is unique before adding it to the deck (Caravan rules)
    return this.cards.some(card => card.suit === suit && card.value === value);
  }

  addCard(card: ICard): void {
    if (!this.isCardUnique(card.suit, card.value)) {
      this.cards.push(card);
    }
  }

  drawCard(): ICard {
    const card = this.cards.shift();

    if (card) {
      return card;
    } else {
      throw new Error("Cannot draw from an empty deck")
    }
  }

  generate(quantity: number): void {
    while(this.cards.length < quantity) {
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const value = VALUES[Math.floor(Math.random() * VALUES.length)];

      this.addCard({ suit, value });
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the elements at positions i and j
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}