import { AIStrategy } from '../interfaces/AIStrategy';
import { GameAction, GameState } from '../interfaces/IGame';

export class RandomStrategy implements AIStrategy {
  pickMove(gameState: GameState): GameAction {
    const possibleMoves = gameState.AI.generatePossibleMoves();

    // Randomly select one move from all possible moves
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
}
