import { AIStrategy } from "../interfaces/AIStrategy";
import { GameAction, GameState } from "../interfaces/IGame";

export class EasyStrategy implements AIStrategy {
  // Logic for making a move on the "Easy" difficulty.
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
