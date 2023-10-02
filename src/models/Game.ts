import { Deck } from "./Deck";
import { IDeck } from "./interfaces/IDeck";
import { IGame } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Game implements IGame {
  players: IPlayer[];
  discardPile: IDeck;

  constructor(players: IPlayer[] = [], discardPile: IDeck = new Deck()) {
    this.players = players;
    this.discardPile = discardPile;
  }

  start() {
    // Initialize game, deal cards to players, etc.
  }

  playTurn(player: IPlayer, cardIndex: number, caravanIndex: number) {
    // Implement the logic to play a turn
  }

  validateMove(player: IPlayer, cardIndex: number, caravanIndex: number): boolean {
    // Validate if the move is legal according to game rules
    return true;
  }

  checkForWinner(): IPlayer | null {
    // Check if there is a winner and return the winning player or null if no winner yet
    return null;
  }
}
