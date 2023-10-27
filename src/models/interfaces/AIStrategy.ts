import { GameAction, GameState } from "./IGame";

/**
 * Represents a strategy for AI to decide its next move in the game.
 */
export interface AIStrategy {
  /**
   * Determines the next move for the AI based on the current game state.
   * This action/move can be used in a turn during the game.
   * @param gameState - The current state of the game.
   * @returns {GameAction} - The action the AI decides to take.
   */
  pickMove(gameState: GameState): GameAction;
}
