import { IPlayer } from "./IPlayer";

export interface IGame {
  players: IPlayer[];

  start(): void;
  playTurn(player: IPlayer, cardIndex: number, caravanIndex: number): void;
  validateMove(player: IPlayer, cardIndex: number, caravanIndex: number): boolean;
  checkForWinner(): IPlayer | null;
}
