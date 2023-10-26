
/**
 * Types and constants related to card properties.
 */

/**
 * Represents possible card values.
 */
export type CardValue = "Ace" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "Jack" | "Queen" | "King" | "Joker";

/**
 * Represents possible card suits.
 */
export type CardSuit = "Hearts" | "Diamonds" | "Clubs" | "Spades";

/**
 * Represents possible card themes.
 */
export type CardTheme = "Default" | "Vault 21" | "Ultra-Luxe" | "Silver Rush" | "The Tops" | "Atomic Wrangler Casino" | "Lucky 38" | "Gomorrah" | "Bison Steve";

/**
 * Maps card values to their numerical representations.
 */
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
  "Jack": 0,
  "Queen": 0,
  "King": 0,
  "Joker": 0,
};

/** Array of all card values. */
export const VALUES = Object.keys(ValueMapping) as CardValue[];

/** Array of non-face card values. */
export const VALUED_CARDS = VALUES.filter((value) => !["Jack", "Queen", "King", "Joker"].includes(value));

/** Array of face card values. */
export const FACE_CARDS = VALUES.filter((value) => ["Jack", "Queen", "King", "Joker"].includes(value));

/** Array of card suits. */
export const SUITS: CardSuit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];

/** Array of card themes. */
export const THEMES: CardTheme[] = ["Default", "Vault 21", "Ultra-Luxe", "Silver Rush", "The Tops", "Atomic Wrangler Casino", "Lucky 38", "Gomorrah", "Bison Steve"];
