import { ICaravan } from "./ICaravan";
import { ICard } from "./ICard";
import { IPlayer } from "./IPlayer";

export interface IGame {
  players: IPlayer[];
  currentPlayerIndex: number;

  start(): void;
  playTurn(card: ICard, caravan: ICaravan): void;
  validateMove(player: IPlayer, card: ICard, target: ICard | ICaravan): boolean;
  checkForWinner(): IPlayer | null;
}
