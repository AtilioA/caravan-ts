import { InvalidGameState } from "../exceptions/GameExceptions";
import { IGame } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Game implements IGame {
  players: IPlayer[];

  constructor(players: IPlayer[] = []) {
    this.players = players;
  }

  start() {
    // Sanity checks (sizes of players, decks, etc.)
    if (this.players.length != 2) {
      throw new InvalidGameState('Cannot start a game with more or less than two players.')
    } else {
      for (let player of this.players) {
        if (player.cardSet.getSize() < 30) {
          throw new InvalidGameState('Cannot start a game with a player with a deck having less than 30 cards.');
        } else if (player.cardSet.getSize() > 216) {
          throw new InvalidGameState('Cannot start a game with a player with a deck having more than 216 cards.');
        }
      }
    }

    // Initialize game, deal cards to players, etc.
    // NOTE: this is a naive approach purpo to approach what would happen in real life
    for (let player of this.players) {
      let valuedCards = 0;

      // Keep drawing until there are at least 3 valued cards in hand
      // while (valuedCards < 3) {
        // Return the cards from hand to cardSet
        while (player.hand.length > 0) {
            const card = player.hand.pop();
            if (card) {
                player.cardSet.addCard(card);
            }
        }

        // Reshuffle the deck and draw 8 new cards
        player.cardSet.shuffle();
        player.drawHand(8);

        // Check how many valued cards are in hand; if less than 3, repeat
        valuedCards = player.hand.filter(card => !card.isFaceCard()).length;
      // }
    }
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
