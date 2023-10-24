export type CardValue = "Ace" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "Jack" | "Queen" | "King" | "Joker";
export type CardSuit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type CardTheme = "Default" | "Vault 21" | "Ultra-Luxe" | "Silver Rush" | "The Tops" | "Atomic Wrangler Casino" | "Lucky 38" | "Gomorrah" | "Bison Steve";
export const ValueMapping: Record<CardValue, number> = {
  "Ace": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  // Face cards do not have a value (NOTE: that should not be important)
  "Jack": 0,
  "Queen": 0,
  "King": 0,
  "Joker": 0,
};
export const VALUES = Object.keys(ValueMapping) as CardValue[];
export const VALUED_CARDS = VALUES.filter((value) => !["Jack", "Queen", "King", "Joker"].includes(value));
export const FACE_CARDS = VALUES.filter((value) => ["Jack", "Queen", "King", "Joker"].includes(value));

export const SUITS: CardSuit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
export const THEMES: CardTheme[] = ["Default", "Vault 21", "Ultra-Luxe", "Silver Rush", "The Tops", "Atomic Wrangler Casino", "Lucky 38", "Gomorrah", "Bison Steve"];
