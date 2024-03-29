// import { MockProxy } from "jest-mock-extended"; // You need to install jest-mock-extended for mocking interfaces
import { GameAction, GameState } from "../models/interfaces/IGame";
// import { ICard } from "../models/interfaces/ICard";
import { EasyStrategy } from "../models/AI/EasyStrategy";
import { RandomStrategy } from "../models/AI/RandomStrategy";
import { createMockCard, createMockPlayer } from "./__mocks__/mockFactories";
import { AIStrategy } from "../models/interfaces/AIStrategy";

describe("AI Strategies", () => {
  let gameState: GameState;
  // let mockCard: MockProxy<ICard>;
  let easyStrategy: EasyStrategy;
  let randomStrategy: RandomStrategy;

  function commonStrategyTests(strategy: AIStrategy, strategyName: string) {
    describe(`Strategies common tests (testing ${strategyName})`, () => {
      it("should not return a discard during an opening round.", () => {
        gameState.AIPlayer.hand = [createMockCard("Ace", "Spades"), createMockCard("7", "Diamonds")];
        const invalidAction: GameAction = {
          player: gameState.AIPlayer,
          action: {
            type: "DISCARD_DRAW",
            card: gameState.AIPlayer.hand[0]
          }
        };

        const possibleMoves = gameState.AIPlayer.generatePossibleMoves(true);

        expect(possibleMoves).not.toContainEqual(invalidAction);
      });

      it("should not return a disband during an opening round.", () => {
        gameState.AIPlayer.hand = [createMockCard("Ace", "Spades"), createMockCard("7", "Diamonds")];
        const invalidAction: GameAction = {
          player: gameState.AIPlayer,
          action: {
            type: "DISBAND_CARAVAN",
            caravan: gameState.AIPlayer.caravans[0]
          }
        };

        const possibleMoves = gameState.AIPlayer.generatePossibleMoves(true);

        expect(possibleMoves).not.toContainEqual(invalidAction);
      });
    });
  }

  beforeEach(() => {
    // Set up a mock game state
    gameState = {
      humanPlayer: createMockPlayer(),
      AIPlayer: createMockPlayer(),
      currentPlayerIndex: 1, // Assume it's the AI's turn
      isOpeningRound: true, // Assume it's the opening round
    };

    gameState.AIPlayer.drawHand(8);
    gameState.humanPlayer.drawHand(8);

    // Initialize strategies
    easyStrategy = new EasyStrategy();
    randomStrategy = new RandomStrategy();
  });

  describe("EasyStrategy", () => {
    commonStrategyTests(easyStrategy, "EasyStrategy");

    it("should return a valid DISCARD_DRAW action if not on opening round.", () => {
      gameState.isOpeningRound = false;
      const action: GameAction = easyStrategy.pickMove(gameState);

      // Check that the action is of type DISCARD_DRAW and involves the first card in the player's hand
      expect(action).toEqual({
        player: gameState.AIPlayer,
        action: { type: "DISCARD_DRAW", card: gameState.AIPlayer.hand[0] }
      });
    });

    it("should return a valid opening round action.", () => {
      gameState.isOpeningRound = true;
      const action: GameAction = easyStrategy.pickMove(gameState);

      const possibleMoves = gameState.AIPlayer.generatePossibleMoves(true);
      expect(possibleMoves).toContainEqual(action);
    });
  });

  describe("RandomStrategy", () => {
    commonStrategyTests(randomStrategy, "RandomStrategy");

    it("should return a valid random action from possible moves during an opening round.", () => {
      gameState.AIPlayer.hand = [createMockCard("Ace", "Spades"), createMockCard("7", "Diamonds")];
      const action: GameAction = randomStrategy.pickMove(gameState);

      const possibleMoves = gameState.AIPlayer.generatePossibleMoves(true);

      expect(possibleMoves).toContainEqual(action);
    });

    it("should return a valid random action from possible moves.", () => {
      gameState.AIPlayer.hand = [createMockCard("Ace", "Spades"), createMockCard("7", "Diamonds")];
      const action: GameAction = randomStrategy.pickMove(gameState);

      const possibleMoves = gameState.AIPlayer.generatePossibleMoves();

      expect(possibleMoves).toContainEqual(action);
    });
  });
});
