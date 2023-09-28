import { Card } from "../models/Card";

describe('Card', () => {
    it('should create a card with a given value and suit', () => {
        const card = new Card('Ace', 'Spades');
        expect(card.value).toBe('Ace');
        expect(card.suit).toBe('Spades');
    });
});
