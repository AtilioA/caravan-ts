import { SUITS, THEMES, VALUED_CARDS, VALUES } from "../constants/cardConstants";
import { Card } from "../models/Card";

export function getRandomValue() {
  return VALUES[Math.floor(Math.random() * VALUES.length)];
}
export function getRandomValueNonFace() {
  return VALUED_CARDS[Math.floor(Math.random() * VALUED_CARDS.length)];
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
