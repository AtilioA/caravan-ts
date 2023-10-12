import { AIStrategy } from '../interfaces/AIStrategy';
import { GameAction, GameState } from '../interfaces/IGame';

export class RandomStrategy implements AIStrategy {
  makeMove(gameState: GameState): GameAction {
    const possibleMoves = gameState.AI.generatePossibleMoves();
    // Randomly select one move from all possible moves
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return randomMove;
  }
}
