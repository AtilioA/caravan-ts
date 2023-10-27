import { AIStrategy } from "../interfaces/AIStrategy";
import { GameAction, GameState } from "../interfaces/IGame";

/**
 * EasyStrategy for the AI player.
 * The strategy is designed to make very simple moves, especially suitable for players who are new or looking for a relaxed game.
 * This strategy does not pose a challenge at all, and almost always makes moves that are self-detrimental.
 */
export class EasyStrategy implements AIStrategy {
  /**
   * Determines the next move for the AI based on the "Easy" strategy logic.
   * @param gameState - The current state of the game.
   * @returns {GameAction} - The action the AI decides to take based on the "Easy" strategy.
   */
  pickMove(gameState: GameState): GameAction {
    if (!gameState.isOpeningRound) {
      return { player: gameState.AI, action: { type: "DISCARD_DRAW", card: gameState.AI.hand[0] } };
    } else {
      // REFACTOR: maybe remove this duplication
      const possibleMoves = gameState.AI.generatePossibleMoves(gameState.isOpeningRound);

      // Randomly select one move from all possible moves
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }
}
