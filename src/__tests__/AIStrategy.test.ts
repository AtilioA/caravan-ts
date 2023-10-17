import { mock, MockProxy } from 'jest-mock-extended'; // You need to install jest-mock-extended for mocking interfaces
import { GameAction, GameState } from '../models/interfaces/IGame';
import { IPlayer } from '../models/interfaces/IPlayer';
import { ICard } from '../models/interfaces/ICard';
import { ICaravan } from '../models/interfaces/ICaravan';
import { EasyStrategy } from '../models/AI/EasyStrategy';
import { RandomStrategy } from '../models/AI/RandomStrategy';
import { createMockCard, createMockPlayer } from './__mocks__/mockFactories';

describe('AI Strategies', () => {
  let gameState: GameState;
  let mockCard: MockProxy<ICard>;
  let easyStrategy: EasyStrategy;
  let randomStrategy: RandomStrategy;

  beforeEach(() => {
    // Set up a mock game state
    gameState = {
      human: createMockPlayer(),
      AI: createMockPlayer(), // Using the same mock for both human and AI for simplicity
      currentPlayerIndex: 1, // Assume it's the AI's turn
    };

    // Initialize strategies
    easyStrategy = new EasyStrategy();
    randomStrategy = new RandomStrategy();
  });

  describe('EasyStrategy', () => {
    it('should return a valid DISCARD_DRAW action', () => {
      const action: GameAction = easyStrategy.pickMove(gameState);

      // Check that the action is of type DISCARD_DRAW and involves the first card in the player's hand
      expect(action).toEqual({
        player: gameState.AI,
        action: { type: 'DISCARD_DRAW', card: mockCard }
      });
    });
  });

  describe('RandomStrategy', () => {
    it('should return a valid action from possible moves', () => {
      gameState.AI.hand = [createMockCard('Ace', 'Spades'), createMockCard('7', 'Diamonds')]
      const action: GameAction = randomStrategy.pickMove(gameState);

      const possibleMoves = gameState.AI.generatePossibleMoves();

      expect(possibleMoves).toContainEqual(action);
    });
  });

  // ...additional tests for edge cases, invalid game states, etc.
});
