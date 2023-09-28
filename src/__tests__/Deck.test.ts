import { Card } from "../models/Card";
import { Deck } from "../models/Deck";

describe('Deck', () => {
  // Deck initialization
  it('should create a deck with an empty set of cards', () => {
      const deck = new Deck();
      expect(deck.cards.length).toEqual(0);
  });

  it('should create a deck with a set of cards', () => {
    const deck = new Deck();
    deck.generate(40);
    expect(deck.cards.length).toEqual(40);
  });

  it('should be initialized with at least 30 cards.', () => {
    const deck = new Deck();
    // Generate between 30 and 60 cards
    deck.generate(Math.floor(Math.random() * 30) + 30);
    expect(deck.cards.length).toBeGreaterThanOrEqual(30);
  });

  // Card addition
  it('should add a card to the deck', () => {
    const deck = new Deck();
    deck.addCard(new Card('Ace', 'Spades'));
    expect(deck.cards.length).toEqual(1);
  });

  it('should not allow duplicate cards from the same set', () => {
    const deck = new Deck();
    deck.addCard(new Card('Ace', 'Spades'));
    deck.addCard(new Card('Ace', 'Spades'));
    expect(deck.cards.length).toEqual(1);
  });

  // Card drawing
  it('should draw a card from the deck', () => {
      const deck = new Deck();
      deck.generate(40);

      // Aux variables for testing
      const deckLength = deck.cards.length;
      const firstCard = deck.cards[0];

      // Begin drawing card
      const card = deck.drawCard();
      expect(card).toBeDefined();
      expect(deck.cards.length).toBeLessThan(deckLength);

      // Card should no longer be in the deck
      expect(deck.cards.includes(card)).toBe(false);

      // Card should have been the first in the deck
      expect(card).toEqual(firstCard);
  });

  it('should shuffle the deck of cards', () => {
    const deck = new Deck();
    deck.generate(40);

    // Store a copy of the original deck
    const originalDeck = [...deck.cards];

    // Shuffle the deck
    deck.shuffle();

    // Expect that the deck is not in the same order (might fail astronomically rarely)
    expect(deck.cards).not.toEqual(originalDeck);

    // Expect that the deck has the same cards as before the shuffle
    expect(deck.cards).toEqual(expect.arrayContaining(originalDeck));
    expect(originalDeck).toEqual(expect.arrayContaining(deck.cards));

    // Expect that the length of the deck remains the same
    expect(deck.cards.length).toEqual(originalDeck.length);
  });
});