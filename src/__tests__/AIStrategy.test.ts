import { MockProxy } from 'jest-mock-extended'; // You need to install jest-mock-extended for mocking interfaces
import { GameAction, GameState } from '../models/interfaces/IGame';
import { ICard } from '../models/interfaces/ICard';
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
      AI: createMockPlayer(),
      currentPlayerIndex: 1, // Assume it's the AI's turn
      isOpeningRound: true, // Assume it's the opening round
    };

    gameState.AI.drawHand(8);
    gameState.human.drawHand(8);

    // Initialize strategies
    easyStrategy = new EasyStrategy();
    randomStrategy = new RandomStrategy();
  });

  describe('EasyStrategy', () => {
    it('should return a valid DISCARD_DRAW action if not on opening round', () => {
      gameState.isOpeningRound = false;
      const action: GameAction = easyStrategy.pickMove(gameState);

      // Check that the action is of type DISCARD_DRAW and involves the first card in the player's hand
      expect(action).toEqual({
        player: gameState.AI,
        action: { type: 'DISCARD_DRAW', card: gameState.AI.hand[0] }
      });
    });

    it('should return a valid opening round action', () => {
      gameState.isOpeningRound = true;
      const action: GameAction = easyStrategy.pickMove(gameState);

      const possibleMoves = gameState.AI.generatePossibleMoves(true);
      expect(possibleMoves).toContainEqual(action);
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
});
