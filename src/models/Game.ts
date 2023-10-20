import { InvalidGameState, InvalidPlayError } from "../exceptions/GameExceptions";
import { isCaravan } from "../utils/caravan";
import { EventEmitter } from "./EventEmitter";
import { AIStrategy } from "./interfaces/AIStrategy";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IEventEmitter } from "./interfaces/IEventEmitter";
import { GameAction, GameState, IGame } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Game implements IGame {
  isOver: boolean = false;
  isOpeningRound: boolean = true;
  currentRound: number = 1;
  players: IPlayer[];
  currentPlayerIndex: number;
  currentAIStrategy: AIStrategy | null;
  events: IEventEmitter;

  constructor(players: IPlayer[] = [], currentPlayerIndex: number = 0, events: IEventEmitter = new EventEmitter(), isOver: boolean = false, isOpeningRound: boolean = true, currentRound: number = 1, currentAIStrategy = null) {
    this.players = players;
    this.currentPlayerIndex = currentPlayerIndex || 0;
    this.events = events;
    this.isOver = isOver;
    this.isOpeningRound = isOpeningRound;
    this.currentRound = currentRound;
    this.currentAIStrategy = currentAIStrategy;

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this.events.on('playCardOnCaravan', this.playCardToCaravan.bind(this));
    this.events.on('playCardOnCard', this.playCardOnCard.bind(this));
    this.events.on('disbandCaravan', this.disbandCaravan.bind(this));
    this.events.on('gameStarted', this.setOpeningRound.bind(this, true));
    this.events.on('gameOver', this.end.bind(this));
    this.events.on('updateCaravansBids', this.updateBids.bind(this));
    this.events.on('updateCaravanBid', (caravan: ICaravan) => {
      caravan.bid = caravan.computeValue();
    });
    this.events.on('endTurn', this.endCurrentTurn.bind(this));
    this.events.on('nextTurn', this.moveToNextTurn.bind(this));
  }

  private setOpeningRound(openingRound: boolean): void {
    this.isOpeningRound = openingRound;
  }

  private getCurrentGameState(): GameState {
    return {
      human: this.players[0],
      AI: this.players[1],
      currentPlayerIndex: this.currentPlayerIndex,
      isOpeningRound: this.isOpeningRound,
    }
  }

  private playOpeningTurn(play: GameAction) {
    const currentPlayer = this.getCurrentPlayer();
    const player = play.player;

    if (currentPlayer !== player) {
      throw new InvalidPlayError('Cannot play a turn for a player that is not the current player.');
    }

    switch (play.action.type) {
      case 'PLAY_CARD':
        // REVIEW: maybe this should be handled somewhere else? Well, this logic is related to the opening rounds in the Game entity, so maybe it's fine here
        if (play.action.card.isFaceCard()) {
          throw new InvalidPlayError('Cannot play a face card during opening rounds.');
        // This isCaravan(target) should always be true during opening rounds
        } else if (isCaravan(play.action.target) && !play.action.target.isEmpty()) {
          throw new InvalidPlayError('Cannot play a valued card on a caravan that is not empty during opening rounds.');
        } else {
          this.playCard(play.action.card, play.action.target);
        }
        break;

      default:
        throw new InvalidPlayError('Invalid opening turn; please check the game rules.');
    }

    this.events.emit('endTurn');
  }

  private updateBids(): void {
    // Call compute value for each caravan of each player
    for (let player of this.players) {
      for (let caravan of player.caravans) {
        this.events.emit('updateCaravanBid', caravan);
      }
    }
  }

  private endCurrentTurn(): void {
    // Update bids of all caravans
    this.events.emit('updateCaravansBids');

    this.currentRound++;

    // Check for any game-winning conditions
    const winner = this.checkForWinner();
    if (winner) {
      this.events.emit('gameOver', {winner});
    } else {
      // Move to the next turn
      this.events.emit('nextTurn', {currentPlayer: this.getCurrentPlayer()});
    }
  }

  private validateDiscardDraw(player: IPlayer, card: ICard): boolean {
    if (player.hand.includes(card)) {
      return true;
    } else {
      return false;
    }
  }

  private validateCaravanDisband(player: IPlayer, caravan: ICaravan): boolean {
    if (player.caravans.includes(caravan) && caravan.cards.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  private disbandCaravan(player: IPlayer, caravan: ICaravan): void {
    player.disbandCaravan(caravan);
    // this.events.emit('disbandCaravan', this.getCurrentPlayer(), caravan);
  }

  private playCard(card: ICard, target: ICard | ICaravan): void {
    // if (this.validateMove(this.getCurrentPlayer(), card, target)) {
      this.playCardToTarget(this.getCurrentPlayer(), card, target);
    // } else {
      // throw new InvalidPlayError('Invalid card play; please check the game rules or try a different move.');
    // }
  }

  private playCardToTarget(player: IPlayer, card: ICard, target: ICaravan | ICard): void {
    if (isCaravan(target)) {
      this.events.emit('playCardOnCaravan', player, card, target);
    } else if (card.isFaceCard()) {
        this.events.emit('playCardOnCard', player, card, target);
    } else {
      this.events.emit('invalidPlay', {player, card, target});
      throw new InvalidPlayError('Cannot play a valued card on a card');
    }
  }

  private playCardToCaravan(player: IPlayer, card: ICard, caravan: ICaravan): void {
    if ((!card.isFaceCard() || card.value === "Queen") && player.caravans.includes(caravan)) {
      player.playCard(card, caravan);
    } else {
      this.events.emit('invalidPlay', {player, card, caravan});
      throw new InvalidPlayError('Cannot extend an opponent\'s caravan with a valued card');
    }
  }

  private playCardOnCard(player: IPlayer, card: ICard, targetCard: ICard): void {
    if (card.isFaceCard() && card.value !== "Queen") {
      player.attachFaceCard(card, targetCard);
      // if (card.value === "Jack") {
      //   this.events.emit('playJack', {player, card, targetCard});
      // } else if (card.value === "King") {
      //   this.events.emit('playKing', {player, card, targetCard});
      // } else if (card.value === "Joker") {
      //   if (targetCard.value === "Ace") {
      //     this.events.emit('playJokerOnAce', {player, card, targetCard});
      //   } else {
      //     this.events.emit('playJokerOnNumber', {player, card, targetCard});
      //   }
      // }
    }
    else {
      this.events.emit('invalidPlay', {player, card, targetCard});
      throw new InvalidPlayError('Can only attach Jacks, Kings, and Jokers to cards');
    }
  }

  private isPlayerOutOfCards(player: IPlayer): boolean {
    return player.hand.length === 0 && player.cardSet.cards.length === 0;
  }

  private isAnyPlayerOutOfCards(): IPlayer | null {
    if (this.isPlayerOutOfCards(this.players[0])) {
      return this.players[1];
    } else if (this.isPlayerOutOfCards(this.players[1])) {
      return this.players[0];
    }

      return null;
    }

  private checkSoldCaravans(): IPlayer | null {
    let soldCaravans = {
      player1: 0,
      player2: 0
    };
    let outBidCaravans = {
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
              outBidCaravans.player1++;
          } else {
              outBidCaravans.player2++;
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

    if (tiedCaravansCount == 0) {
      // Remember, all these conditions assume no ties
      // Check outright winners
      if (soldCaravans.player1 >= 2) {
          return this.players[0];
      } else if (soldCaravans.player2 >= 2) {
          return this.players[1];
      // Check for majority winners (having at least 2 more caravans outbid or sold than the other player)
      } else if ((outBidCaravans.player1 + soldCaravans.player1) - (outBidCaravans.player2 + soldCaravans.player2) >= 2) {
          return this.players[0];
      } else if ((outBidCaravans.player2 + soldCaravans.player2) - (outBidCaravans.player1 + soldCaravans.player1) >= 2) {
          return this.players[1];
      }
    }

    return null;
  }

  private moveToNextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  setAIStrategy(strategy: AIStrategy): void {
    this.currentAIStrategy = strategy;
  }

  nextAIMove(): void {
  if (!this.currentAIStrategy) {
      throw new InvalidGameState('Cannot make an AI move when there is no AI strategy set.');
    } else {
      const move = this.currentAIStrategy.pickMove(this.getCurrentGameState());
      this.playTurn(move);
    }
  }

  getCurrentPlayer(): IPlayer {
    return this.players[this.currentPlayerIndex];
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
      player.cardSet.shuffle();

      let valuedCardsAdded = 0; // Counter for valued cards added to hand
      let cardsToKeep = []; // Cards that will remain in the cardSet
      for (let card of player.cardSet.cards) {
        // If it's a valued card and we still need more for the hand
        if (!card.isFaceCard() && valuedCardsAdded < 3) {
          player.hand.push(card);
          valuedCardsAdded++;
        } else {
          cardsToKeep.push(card);
        }
      }
      player.cardSet.cards = cardsToKeep; // Update the cardSet with the remaining cards

      player.drawHand(5);
    }

    this.events.emit('gameStarted', {currentPlayer: this.getCurrentPlayer()});
  }

  playTurn(play: GameAction) {
    if (this.isOver) {
      throw new InvalidPlayError('Cannot play a turn on a match that is already over.');
    } else if (this.isOpeningRound) {
      if (this.currentRound >= 6) {
        this.setOpeningRound(false);
      } else {
        return this.playOpeningTurn(play);
      }
    }

    const currentPlayer = this.getCurrentPlayer();
    const player = play.player;

    if (currentPlayer !== player) {
      throw new InvalidPlayError('Cannot play a turn for a player that is not the current player.');
    }

    switch (play.action.type) {
      case 'PLAY_CARD':
        this.playCard(play.action.card, play.action.target);
        break;

      case 'DISBAND_CARAVAN':
        if (this.validateCaravanDisband(currentPlayer, play.action.caravan)) {
          this.disbandCaravan(currentPlayer, play.action.caravan)
        } else {
          throw new InvalidPlayError('Invalid caravan disbanding; please check the game rules or try a different move.');
        }
        break;

      case 'DISCARD_DRAW':
        if (this.validateDiscardDraw(currentPlayer, play.action.card)) {
          currentPlayer.discardCard(play.action.card);
          if (currentPlayer.canDrawCard()) {
            currentPlayer.drawCard();
          }
        } else {
          throw new InvalidPlayError('Invalid discard and draw; please check the game rules or try a different move.');
        }
        break;
    }

    this.updateBids();
    this.endCurrentTurn();
  }

  checkForWinner(): IPlayer | null {
    const soldCaravanWinner = this.checkSoldCaravans();
    if (soldCaravanWinner) {
        return soldCaravanWinner;
    }

    // Check for ending condition based on card availability.
    // Since this is done after checking for sold caravans, we can assume that there is no definite winner yet based on sold caravans.
    // NOTE: This might not be needed (i.e. handle this with an event or caught exception when drawing a card)
    return this.isAnyPlayerOutOfCards();
  }

  // End the Caravan match
  end(): void {
    this.isOver = true;
  }
}
