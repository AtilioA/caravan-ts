import { GameAction, GameState } from "./IGame";

export interface AIStrategy {
  pickMove(gameState: GameState): GameAction;
}
