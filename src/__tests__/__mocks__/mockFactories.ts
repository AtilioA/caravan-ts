import { CardSuit, CardValue, SUITS, VALUES } from "../../constants/cardConstants";
import { Caravan } from "../../models/Caravan";
import { Card } from "../../models/Card";
import { Deck } from "../../models/Deck";
import { Player } from "../../models/Player";
import { ICaravan } from "../../models/interfaces/ICaravan";
import { ICard } from "../../models/interfaces/ICard";
import { IDeck } from "../../models/interfaces/IDeck";
import { IPlayer } from "../../models/interfaces/IPlayer";

export function createMockCard(value: CardValue, suit: CardSuit): ICard {
  return new Card(value, suit);
}

/**
 * Creates a mock deck with 56 cards, 14 of each suit, with values 1-10, including face cards (Jack, Queen, King, Joker).
 * @returns a mock deck with 56 cards
 */
export function createMockDeck(): IDeck {
  const suits: CardSuit[] = SUITS;
  const values: CardValue[] = VALUES;

  const cards: ICard[] = [];

  for (const suit of suits) {
    for (const value of values) {
      cards.push(
        new Card(value, suit)
      );
    }
  }

  return new Deck(cards);
}

/**
 * Creates a mock player with a default hand and card set.
 *
 * @param overrides - any properties to override on the mock player
 * @returns a mock player
 */
export function createMockPlayer(): IPlayer {
  const defaultHand: ICard[] = [];
  const defaultCardSet: IDeck = createMockDeck();
  const defaultCaravans: ICaravan[] = [createMockCaravan(), createMockCaravan(), createMockCaravan()];

  return new Player(defaultCardSet, defaultHand, defaultCaravans);
}

export function createMockCaravan(): ICaravan {
  return new Caravan(
    [],
    null,
    null,
    0);
}
