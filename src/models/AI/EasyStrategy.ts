import { AIStrategy } from "../interfaces/AIStrategy";
import { GameAction, GameState } from "../interfaces/IGame";

export class EasyStrategy implements AIStrategy {
  // Logic for making a move on the "Easy" difficulty.
  makeMove(gameState: GameState): GameAction {
    return { player: gameState.AI, action: { type: 'DISCARD_DRAW', card: gameState.AI.hand[0] } };
  }
}
