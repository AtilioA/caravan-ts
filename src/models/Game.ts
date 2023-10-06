import { InvalidGameState, InvalidPlayError } from "../exceptions/GameExceptions";
import { isCaravan } from "../utils/caravan";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IGame } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Game implements IGame {
  players: IPlayer[];
  currentPlayerIndex: number;

  constructor(players: IPlayer[] = [], currentPlayerIndex: number = 0) {
    this.players = players;
    this.currentPlayerIndex = currentPlayerIndex || 0;
  }

  getCurrentPlayer(): IPlayer {
    return this.players[this.currentPlayerIndex];
  }

  moveToNextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
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

  playTurn(card: ICard, target: ICard | ICaravan) {
    let currentPlayer = this.getCurrentPlayer();

    // Validate the move
    if (this.validateMove(currentPlayer, card, target)) {
      this.playCardToTarget(currentPlayer, card, target);

      // Check for any game-winning conditions
      this.checkForWinner();

      // Move to the next player's turn
      this.moveToNextTurn();
    } else {
      throw new InvalidPlayError('Unknown invalid move; please check the game rules or try a different move.');
    }
  }

  private playCardToCaravan(player: IPlayer, card: ICard, caravan: ICaravan) {
    if (!card.isFaceCard() && player.caravans.includes(caravan)) {
      player.playCard(card, caravan);
    } else if (card.isFaceCard() && card.value !== "Queen") {
      throw new InvalidPlayError('Only a Queen can be used as face card to extend a caravan');
    } else {
      throw new InvalidPlayError('Cannot extend an opponent\'s caravan with a valued card');
    }
  }

  private playCardToCard(player: IPlayer, card: ICard, target: ICard) {
    if (card.isFaceCard()) {
      target.attachFaceCard(card);
    }
  }

  playCardToTarget(player: IPlayer, card: ICard, target: ICaravan | ICard) {
    if (isCaravan(target)) {
      this.playCardToCaravan(player, card, target);
    } else {
      this.playCardToCard(player, card, target);
    }
  }

  validateMove(player: IPlayer, card: ICard, target: ICard | ICaravan): boolean {
    // Validate if the move is legal according to game rules
    return true;
  }

  checkForWinner(): IPlayer | null {
    // Check if there is a winner and return the winning player or null if no winner yet
    return null;
  }
}
