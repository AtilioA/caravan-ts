import { mock, MockProxy } from 'jest-mock-extended'; // You need to install jest-mock-extended for mocking interfaces
import { GameAction, GameState } from '../models/interfaces/IGame';
import { IPlayer } from '../models/interfaces/IPlayer';
import { ICard } from '../models/interfaces/ICard';
import { ICaravan } from '../models/interfaces/ICaravan';
import { EasyStrategy } from '../models/AI/EasyStrategy';
import { RandomStrategy } from '../models/AI/RandomStrategy';

describe('AI Strategies', () => {
  let gameState: GameState;
  let mockPlayer: MockProxy<IPlayer>;
  let mockCard: MockProxy<ICard>;
  let mockCaravan: MockProxy<ICaravan>;
  let easyStrategy: EasyStrategy;
  let randomStrategy: RandomStrategy;

  beforeEach(() => {
    // Create mocks for the player, card, and caravan
    mockPlayer = mock<IPlayer>();
    mockCard = mock<ICard>();
    mockCaravan = mock<ICaravan>();

    mockPlayer.hand = [mockCard]; // Assume the player has one card in hand

    // Set up a mock game state
    gameState = {
      human: mockPlayer,
      AI: mockPlayer, // Using the same mock for both human and AI for simplicity
      currentPlayerIndex: 1, // Assume it's the AI's turn
    };

    // Initialize strategies
    easyStrategy = new EasyStrategy();
    randomStrategy = new RandomStrategy();
  });

  describe('EasyStrategy', () => {
    it('should return a valid DISCARD_DRAW action', () => {
      const action: GameAction = easyStrategy.makeMove(gameState);

      // Check that the action is of type DISCARD_DRAW and involves the first card in the player's hand
      expect(action).toEqual({
        player: gameState.AI,
        action: { type: 'DISCARD_DRAW', card: mockCard }
      });
    });
  });

  // describe('RandomStrategy', () => {
  //   it('should return a valid action from possible moves', () => {
  //     // Mock the implementation of generatePossibleMoves to return a predefined set of possible actions
  //     mockPlayer.generatePossibleMoves = jest.fn().mockReturnValue([
  //       { type: 'PLAY_CARD', card: mockCard, target: mockCaravan },
  //       { type: 'DISCARD_DRAW', card: mockCard }
  //     ]);

  //     const action: GameAction = randomStrategy.makeMove(gameState);

  //     // Check that the action is one of the possible moves
  //     expect([
  //       { type: 'PLAY_CARD', card: mockCard, target: mockCaravan },
  //       { type: 'DISCARD_DRAW', card: mockCard }
  //       // ...other possible moves
  //     ]).toContainEqual(action.action);
  //   });
  // });

  // ...additional tests for edge cases, invalid game states, etc.
});
