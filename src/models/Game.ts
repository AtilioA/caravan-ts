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
    this.events.on('disbandCaravan', this.disbandCaravan.bind(this));
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
    const currentPlayer = this.getCurrentPlayer();
    switch(action.type) {
      case 'PLAY_CARD':
        this.playCard(action.card, action.target);
        break;

      case 'DISBAND_CARAVAN':
        if (this.validateCaravanDisband(currentPlayer, action.caravan)) {
          this.disbandCaravan(currentPlayer, action.caravan)
        } else {
          throw new InvalidPlayError('Invalid caravan disbanding; please check the game rules or try a different move.');
        }
        break;

      // TODO: Continue from here
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

  private validateCaravanDisband(player: IPlayer, caravan: ICaravan): boolean {
    if (player.caravans.includes(caravan) && caravan.cards.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  private disbandCaravan(player: IPlayer, caravan: ICaravan) {
    player.disbandCaravan(caravan);
    // this.events.emit('disbandCaravan', this.getCurrentPlayer(), caravan);
    this.moveToNextTurn();
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

  // TODO: Continue from here
  validateMove(player: IPlayer, card: ICard, target: ICard | ICaravan): boolean {
    // Validate if the move is legal according to game rules
    return true;
  }

  checkForWinner(): IPlayer | null {
    let soldCaravans = {
      player1: 0,
      player2: 0
    };
    let tiedCaravansCount = 0;

    for (let i = 0; i < 3; i++) {
        let caravanPlayer1 = this.players[0].caravans[i];
        let caravanPlayer2 = this.players[1].caravans[i];

        if (caravanPlayer1.isSold() && caravanPlayer2.isSold()) {
            if (caravanPlayer1.bid === caravanPlayer2.bid) {
                tiedCaravansCount++;
            } else if (caravanPlayer1.bid > caravanPlayer2.bid) {
                soldCaravans.player1++;
            } else {
                soldCaravans.player2++;
            }
        } else {
            if (caravanPlayer1.isSold()) {
                soldCaravans.player1++;
            }
            if (caravanPlayer2.isSold()) {
                soldCaravans.player2++;
            }
        }
    }

    // Check for ending condition based on sold caravans
    if (tiedCaravansCount == 0) {
        if (soldCaravans.player1 >= 2) {
            return this.players[0];
        } else if (soldCaravans.player2 >= 2) {
            return this.players[1];
        }
    }

    // Check for ending condition based on card availability.
    // Since this is done after checking for sold caravans, we can assume that there is no definite winner yet based on sold caravans.
    // NOTE: This might not be needed (i.e. handle this with an event or caught exception when drawing a card)
    if (this.players[0].hand.length === 0 && this.players[0].cardSet.cards.length === 0) {
        return this.players[1];
    } else if (this.players[1].hand.length === 0 && this.players[1].cardSet.cards.length === 0) {
        return this.players[0];
    }

    // Game hasn't ended yet
    return null;
  }

  end(): void {
    // Handle the game ending logic, such as announcing the winner
  }
}
