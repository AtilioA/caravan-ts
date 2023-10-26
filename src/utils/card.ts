import { CardSuit, FACE_CARDS, SUITS, THEMES, VALUED_CARDS, VALUES } from "../constants/cardConstants";
import { Card } from "../models/Card";

/**
 * Gets a random card value.
 * @returns A random card value.
 */
export function getRandomValue() {
  return VALUES[Math.floor(Math.random() * VALUES.length)];
}

/**
 * Gets a random non-face card value.
 * @returns A random non-face card value.
 */
export function getRandomValueNonFace() {
  return VALUED_CARDS[Math.floor(Math.random() * VALUED_CARDS.length)];
}

/**
 * Gets a random face card value.
 * @returns A random face card value.
 */
export function getRandomValueFace() {
  return FACE_CARDS[Math.floor(Math.random() * FACE_CARDS.length)];
}

/**
 * Gets a random card suit.
 * @returns A random card suit.
 */
export function getRandomSuit(): CardSuit {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

/**
 * Gets a random card theme.
 * @returns A random card theme.
 */
export function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

/**
 * Creates a random card.
 * @returns A random card.
 */
export function getRandomCard() {
  return new Card(getRandomValue(), getRandomSuit(), getRandomTheme());
}

/**
 * Creates a random non-face card.
 * @returns A random non-face card.
 */
export function getRandomCardNonFace() {
  return new Card(getRandomValueNonFace(), getRandomSuit(), getRandomTheme());
}

/**
 * Creates a random face card.
 * @returns A random face card.
 */
export function getRandomCardFace() {
  return new Card(getRandomValueFace(), getRandomSuit(), getRandomTheme());
}

/**
 * Generates an array of random cards.
 * @param nCards The number of cards to generate.
 * @param includeFaceCards Whether to include face cards in the generated set.
 * @returns An array of random cards.
 */
export function generateCards(nCards: number = 52, includeFaceCards: boolean = false) {
  const cards = [];
  for (let i = 0; i < nCards; i++) {
    if (!includeFaceCards) {
      cards.push(getRandomCardNonFace());
    } else {
      cards.push(getRandomCard());
    }
  }

  return cards;
}
