import { IDeck } from "./IDeck";
import { IPlayer } from "./IPlayer";

export interface IGame {
  players: IPlayer[];
  discardPile: IDeck;

  start(): void;
  playTurn(player: IPlayer, cardIndex: number, caravanIndex: number): void;
  validateMove(player: IPlayer, cardIndex: number, caravanIndex: number): boolean;
  checkForWinner(): IPlayer | null;
}
