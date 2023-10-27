import { AIStrategy } from "../interfaces/AIStrategy";
import { GameAction, GameState } from "../interfaces/IGame";

/**
 * RandomStrategy for the AI player.
 * The strategy is designed to make moves entirely at random, without any specific logic or consideration. This also means that the AI can make moves that are self-detrimental.
 */
export class RandomStrategy implements AIStrategy {
  /**
   * Determines the next move for the AI based purely on randomness.
   * @param gameState - The current state of the game.
   * @returns {GameAction} - A random action the AI decides to take.
   */
  pickMove(gameState: GameState): GameAction {
    const possibleMoves = gameState.AI.generatePossibleMoves(gameState.isOpeningRound);

    // Randomly select one move from all possible moves
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
}
