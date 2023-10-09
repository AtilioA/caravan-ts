import { InvalidGameState, InvalidPlayError } from "../exceptions/GameExceptions";
import { isCaravan } from "../utils/caravan";
import { EventEmitter } from "./EventEmitter";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IEventEmitter } from "./interfaces/IEventEmitter";
import { IGame, PlayerAction } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Game implements IGame {
  players: IPlayer[];
  currentPlayerIndex: number;
  events: IEventEmitter;

  constructor(players: IPlayer[] = [], currentPlayerIndex: number = 0, events: IEventEmitter = new EventEmitter()) {
    this.players = players;
    this.currentPlayerIndex = currentPlayerIndex || 0;
    this.events = events;

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this.events.on('playCardOnCaravan', this.playCardToCaravan.bind(this));
    // ...
  }

  // Event handlers
  private handleCardPlayed(data: any) {
    // Handle the logic for when a card is played.
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
    // NOTE: this is a naive approach to convey what would happen in real life
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
        // valuedCards = player.hand.filter(card => !card.isFaceCard()).length;
      // }
    }

    this.events.emit('startGame', {currentPlayer: this.getCurrentPlayer()});
  }

  playTurn(action: PlayerAction) {
    switch(action.type) {
      case 'PLAY_CARD':
        this.playCard(action.card, action.target);
        break;

      // case 'DISBAND_CARAVAN':
      //   if (this.validateDisband(currentPlayer, action.caravan)) {
      //     currentPlayer.disbandCaravan(action.caravan);
      //     this.moveToNextTurn();
      //   } else {
      //     throw new InvalidPlayError('Invalid caravan disbanding; please check the game rules or try a different move.');
      //   }
      //   break;

      // case 'DISCARD_DRAW':
      //   if (this.validateDiscardDraw(currentPlayer, action.card)) {
      //     currentPlayer.discardAndDraw(action.card);
      //     this.moveToNextTurn();
      //   } else {
      //     throw new InvalidPlayError('Invalid discard and draw; please check the game rules or try a different move.');
      //   }
      //   break;

      default:
        throw new InvalidPlayError('Unknown action type; please check the game rules or try a different move.');
    }

    // Check for any game-winning conditions
    const winner = this.checkForWinner();
    if (winner) {
      // Handle the game-winning logic, such as announcing the winner
    }
  }

  private playCard(card: ICard, target: ICard | ICaravan) {
    if (this.validateMove(this.getCurrentPlayer(), card, target)) {
      this.playCardToTarget(this.getCurrentPlayer(), card, target);
      this.moveToNextTurn();
    } else {
      throw new InvalidPlayError('Invalid card play; please check the game rules or try a different move.');
    }
  }

  private playCardToTarget(player: IPlayer, card: ICard, target: ICaravan | ICard) {
    if (isCaravan(target)) {
      this.events.emit('playCardOnCaravan', player, card, target);
    } else {
      this.playCardToCard(player, card, target);
      this.events.emit('playCardOnCard', {player, card, target});
    }
  }

  private playCardToCaravan(player: IPlayer, card: ICard, caravan: ICaravan) {
    if (!card.isFaceCard() && player.caravans.includes(caravan)) {
      player.playCard(card, caravan);
    } else if (card.isFaceCard() && card.value !== "Queen") {
      this.events.emit('invalidPlay', {player, card, caravan});
      throw new InvalidPlayError('Only a Queen can be used as face card to extend a caravan');
    } else {
      this.events.emit('invalidPlay', {player, card, caravan});
      throw new InvalidPlayError('Cannot extend an opponent\'s caravan with a valued card');
    }
  }

  private playCardToCard(player: IPlayer, card: ICard, target: ICard) {
    if (card.isFaceCard() && card.value !== "Queen") {
      target.attachFaceCard(card);
      if (card.value === "Jack") {
        this.events.emit('playJack', {player, card, target});
      } else if (card.value === "King") {
        this.events.emit('playKing', {player, card, target});
      } else if (card.value === "Joker") {
        if (target.value === "Ace") {
          this.events.emit('playJokerOnAce', {player, card, target});
        } else {
          this.events.emit('playJokerOnNumber', {player, card, target});
        }
      }
    } else if (card.value === "Queen") {
      this.events.emit('playQueen', {player, card, target});
    }
    else {
      this.events.emit('invalidPlay', {player, card, target});
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

  end(): void {
    // Handle the game ending logic, such as announcing the winner
  }
}
