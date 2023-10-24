import { InvalidPlayError } from "../exceptions/GameExceptions";
import { Card } from "../models/Card";
import { getRandomCard, getRandomSuit, getRandomValueNonFace } from "../utils/card";

describe("Card", () => {
  it("should create a card with a given value and suit", () => {
    const card = new Card("Ace", "Spades");
    expect(card.value).toBe("Ace");
    expect(card.suit).toBe("Spades");
  });

  // Invalid values are not tested because we already have type enforcement with CardValue, CardSuit, and CardTheme
  it("should only allow valid values and suits", () => {
    expect(() => new Card("Ace", "Spades")).not.toThrowError(InvalidPlayError);
  });

  it("should allow any value and suit from cardConstants", () => {
    // Use random values from SUITS and VALUES from cardConstants.ts
    const card = getRandomCard();
    expect(card.value).toBeDefined();
  });

  it("should allow any theme from cardConstants", () => {
    // Use random values from THEMES from cardConstants.ts
    const card = getRandomCard();
    expect(card.theme).toBeDefined();
  });

  it("should allow attaching face cards", () => {
    const card = new Card("Ace", "Spades");
    expect(card.attachedCards.length).toBe(0);

    card.attachFaceCard(new Card("Jack", "Diamonds"));
    expect(card.attachedCards.length).toBe(1);

    card.attachFaceCard(new Card("King", "Spades"));
    expect(card.attachedCards.length).toBe(2);
  });

  it("should not allow attaching more than 3 face cards", () => {
    const card = new Card("Ace", "Spades");
    expect(card.attachedCards.length).toBe(0);

    card.attachFaceCard(new Card("King", "Diamonds"));
    expect(card.attachedCards.length).toBe(1);

    card.attachFaceCard(new Card("King", "Spades"));
    expect(card.attachedCards.length).toBe(2);

    card.attachFaceCard(new Card("King", "Hearts"));
    expect(card.attachedCards.length).toBe(3);

    expect(() => card.attachFaceCard(new Card("Queen", "Diamonds"))).toThrowError(InvalidPlayError);
    expect(card.attachedCards.length).toBe(3);
  });

  it("should not allow attaching a face card that is a Queen", () => {
    const card = new Card("Ace", "Spades");
    expect(card.attachedCards.length).toBe(0);

    expect(() => card.attachFaceCard(new Card("Queen", "Diamonds"))).toThrowError(InvalidPlayError);
    expect(card.attachedCards.length).toBe(0);
  });

  it("should not allow attaching non-face cards", () => {
    const card = new Card("Ace", "Spades");
    expect(card.attachedCards.length).toBe(0);

    const valuedCard = new Card(getRandomValueNonFace(), getRandomSuit());

    expect(() => card.attachFaceCard(valuedCard)).toThrowError(InvalidPlayError);
    expect(card.attachedCards.length).toBe(0);
  });

  it("should return the correct unknown value, considering face cards", () => {
    // Don't use cards without value (face cards)
    const card = new Card(getRandomValueNonFace(), getRandomSuit());
    expect(card.value).toBeDefined();

    // Count the number of kings and multiply the value by 2 to the power of the number of kings.
    const kings = card.attachedCards.filter((card) => card.value === "King").length;
    if (kings > 0) {
      expect(card.computeValue()).toBe(Number(card.getNumericValue()) * Math.pow(2, kings));
    } else {
      expect(card.computeValue()).toBe(Number(card.getNumericValue()));
    }
  });

  it("should return the correct known value, considering face cards", () => {
    const knownCard = new Card("6", "Diamonds");
    knownCard.attachFaceCard(new Card("King", "Hearts"));
    knownCard.attachFaceCard(new Card("King", "Diamonds"));
    expect(knownCard.computeValue()).toBe(6 * Math.pow(2, 2));
  });
});
