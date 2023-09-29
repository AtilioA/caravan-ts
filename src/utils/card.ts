import { FACE_CARDS, SUITS, THEMES, VALUED_CARDS, VALUES } from "../constants/cardConstants";
import { Card } from "../models/Card";

export function getRandomValue() {
  return VALUES[Math.floor(Math.random() * VALUES.length)];
}
export function getRandomValueNonFace() {
  return VALUED_CARDS[Math.floor(Math.random() * VALUED_CARDS.length)];
}
export function getRandomValueFace() {
  return FACE_CARDS[Math.floor(Math.random() * FACE_CARDS.length)];
}
export function getRandomSuit() {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}
export function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

export function getRandomCard() {
  return new Card(getRandomValue(), getRandomSuit(), getRandomTheme());
}
export function getRandomCardNonFace() {
  return new Card(getRandomValueNonFace(), getRandomSuit(), getRandomTheme());
}
export function getRandomCardFace() {
  return new Card(getRandomValueFace(), getRandomSuit(), getRandomTheme());
}

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
