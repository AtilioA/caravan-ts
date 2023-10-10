import { CardTheme, CardValue } from "../constants/cardConstants";
import { InvalidPlayError } from "../exceptions/GameExceptions";
import { getRandomSuit, getRandomTheme, getRandomValue } from "../utils/card";
import { Card } from "./Card";
import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";

export class Deck implements IDeck {
  cards: ICard[] = [];

  constructor(cards: ICard[] = []) {
    this.cards = cards;
  }

  private _isCardUnique(value: CardValue, suit: string, theme: CardTheme): boolean {
    // Check if the card is unique before adding it to the deck (Caravan rules)
    return this.cards.some(card => card.suit === suit && card.value === value && card.theme === theme);
  }

  getSize(): number {
    return this.cards.length;
  }

  addCard(card: ICard): void {
    if (!this._isCardUnique(card.value, card.suit, card.theme)) {
      this.cards.push(card);
    }
  }

  addCards(cards: ICard[]): void {
    for (let card of cards) {
      this.addCard(card);
    }
  }

  drawCard(): ICard {
    const card = this.cards.shift();

    if (card) {
      return card;
    } else {
      throw new InvalidPlayError("Cannot draw a card from an empty deck");
    }
  }

  generate(quantity: number): void {
    while(this.cards.length < quantity) {
      const randomValue = getRandomValue();
      const randomSuit = getRandomSuit();
      const randomTheme = getRandomTheme();

      this.addCard(new Card(randomValue, randomSuit, randomTheme));
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
