import { SUITS, VALUES } from "../constants/cardConstants";
import { Card } from "../models/Card";

describe('Card', () => {
    it('should create a card with a given value and suit', () => {
        const card = new Card('Ace', 'Spades');
        expect(card.value).toBe('Ace');
        expect(card.suit).toBe('Spades');
    });

    it('should only allow valid values and suits', () => {
        // Use SUITS and VALUES from cardConstants.ts, any other value should throw an error
        expect(() => new Card('Ace', 'Spades')).not.toThrow();
        expect(() => new Card('Ace', 'Spade')).toThrow();
        expect(() => new Card('Aces', 'Spades')).toThrow();
        expect(() => new Card('Aces', 'Spade')).toThrow();
    });

    it('should allow any value and suit from cardConstants', () => {
        // Use random values from SUITS and VALUES from cardConstants.ts
        const card = new Card(VALUES[Math.floor(Math.random() * VALUES.length)], SUITS[Math.floor(Math.random() * SUITS.length)]);
        expect(card.value).toBeDefined();
    });
});
