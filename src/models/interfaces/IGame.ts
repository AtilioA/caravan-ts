import { EventEmitter } from "../EventEmitter";
import { ICaravan } from "./ICaravan";
import { ICard } from "./ICard";
import { IPlayer } from "./IPlayer";

export type PlayerAction =
| { type: 'PLAY_CARD', card: ICard, target: ICard | ICaravan }
| { type: 'DISBAND_CARAVAN', caravan: ICaravan }
| { type: 'DISCARD_DRAW', card: ICard };

export interface GameAction {
  player: IPlayer;
  action: PlayerAction;
}

export interface IGame {
  isOver: boolean;
  players: IPlayer[];
  currentPlayerIndex: number;
  events: EventEmitter;

  start(): void;
  end(): void;
  playTurn(action: GameAction): void;
  validateMove(player: IPlayer, card: ICard, target: ICard | ICaravan): boolean;
  checkForWinner(): IPlayer | null;
}
