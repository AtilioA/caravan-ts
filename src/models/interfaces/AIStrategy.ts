import { GameAction, GameState } from "./IGame";

export interface AIStrategy {
  makeMove(gameState: GameState): GameAction;
}
