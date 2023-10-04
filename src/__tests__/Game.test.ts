// Tests for the Game Entity:
    // Should play a turn, with a player playing a card to a caravan.
    // Should validate moves correctly, allowing valid moves and disallowing invalid ones.
    // Should determine the winner correctly based on the game's rules.
    // Should handle special cards (like Joker) and their effects on the game state correctly.
    // Should not allow moves if it’s not the player’s turn.
    // Should handle the end of the game correctly, allowing no more moves after the game ends.
    // Validate players can only place number cards (2-10) or aces during the opening round.
    // Validate that discarding is not allowed during the opening round.
    // Validate that a caravan is considered sold only between a bid of 21-26.
    // Discard pile should have cards after a caravan is discarded (i.e. all cards from that caravan).

import { InvalidGameState } from "../exceptions/GameExceptions";
import { Deck } from "../models/Deck";
import { Game } from "../models/Game";
import { generateCards } from "../utils/card";
import { createMockPlayer } from "./__mocks__/mockFactories";

// let drawHandCallCount = 0;

// beforeEach(() => {
//   drawHandCallCount = 0;
// });

describe('Game', () => {
  it('should initialize the game with the correct initial state', () => {
    const game = new Game();
    expect(game.players.length).toEqual(0);
  });

  it('should not start a game with less than two players', () => {
    const game = new Game();

    expect(game.players.length).toEqual(0);
    expect(() => game.start()).toThrowError(InvalidGameState);
    expect(game.players.length).toEqual(0);
  });

  it('should not start the game with the more than two players', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer(), createMockPlayer()]
    const game = new Game(mockPlayers);

    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should not start a game with a player with less than 30 cards', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    mockPlayers[0].cardSet = new Deck(generateCards(29));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should not start a game with a player with more than 216 cards', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    mockPlayers[0].cardSet = new Deck(generateCards(217));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should start the game, dealing 8 cards to each player', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    const game = new Game(mockPlayers);
    game.start();

    expect(mockPlayers[0].hand.length).toEqual(8);
    expect(mockPlayers[1].hand.length).toEqual(8);
  });

  // it('should reshuffle a player deck if they do not have at least three valued cards, and draw eight new cards', () => {
  //   const mockPlayers = [new MockedPlayer(), new MockedPlayer()]

  //   // mockPlayers[0].drawHand = jest.fn((n) => {
  //   //     drawHandCallCount++;

  //   //     if (drawHandCallCount === 1) {
  //   //         mockPlayers[0].hand = [ getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace() ];
  //   //     } else {
  //   //         mockPlayers[0].hand = generateCards(8, false);
  //   //     }
  //   // });

  //   const game = new Game(mockPlayers);

  //   // const mockHand = [...Array(8).keys()].map(_ => {
  //   //   return { isFaceCard: jest.fn(() => true) } as unknown as ICard;
  //   // });

  //   // const drawHandSpy1 = jest.spyOn(mockPlayers[0], 'drawHand').mockImplementation((n: number) => {
  //   //   mockPlayers[0].hand = mockHand;
  //   // });

  //   // const drawHandSpy2 = jest.spyOn(mockPlayers[1], 'drawHand').mockImplementation((n: number) => {
  //   //   mockPlayers[1].hand = mockHand;
  //   // });

  //   game.start();

  //   // Now, make the assertion
  //   const valuedCardsPlayer1 = mockPlayers[0].hand.filter(card => !card.isFaceCard());
  //   const valuedCardsPlayer2 = mockPlayers[1].hand.filter(card => !card.isFaceCard());

  //   expect(valuedCardsPlayer1.length).toBeGreaterThanOrEqual(3);
  //   expect(valuedCardsPlayer2.length).toBeGreaterThanOrEqual(3);

  //   // drawHandSpy1.mockRestore();
  //   // drawHandSpy2.mockRestore();
  // });
});
