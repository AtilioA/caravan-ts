import { InvalidPlayError } from "../exceptions/GameExceptions";
import { removeItemFromArray } from "../utils/array";
import { Caravan } from "./Caravan";
import { Deck } from "./Deck";
import { EventBus } from "./EventBus";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";
import { GameAction } from "./interfaces/IGame";
import { IPlayer } from "./interfaces/IPlayer";

export class Player implements IPlayer {
  cardSet: IDeck = new Deck();
  hand: ICard[] = [];
  caravans: ICaravan[] = [new Caravan(), new Caravan(), new Caravan()];
  discardPile: IDeck = new Deck();

  constructor(cardSet: IDeck = new Deck(), hand: ICard[] = [], caravans: ICaravan[] = [new Caravan(), new Caravan(), new Caravan()], discardPile: IDeck = new Deck()) {
    this.cardSet = cardSet;
    this.hand = hand;
    this.caravans = caravans;
    this.discardPile = discardPile;

    const eventBus = EventBus.getInstance();
    eventBus.subscribe("cardDiscarded", this.handleCardDiscarded.bind(this));
    eventBus.subscribe("playCard", this.handleCardPlayed.bind(this));
    eventBus.subscribe("disbandCaravan", this.handleDisbandCaravan.bind(this));
  }

  private handleDisbandCaravan({player, caravan}: {player: IPlayer, caravan: ICaravan}): void {
    if (player === this) {
      player.disbandCaravan(caravan);
    }
  }

  private handleCardPlayed({player, card, caravan}: {player: IPlayer, card: ICard, caravan: ICaravan}): void {
    if (player === this) {
      player.playCard(card, caravan);
    }
  }

  private handleCardDiscarded({ card, sourceCaravan }: { card: ICard, sourceCaravan: ICaravan }): void {
    if (this.caravans.includes(sourceCaravan)) {
      return this.discardPile.addCard(card);
    }
  }

  private _addToHand(card: ICard): void {
    this.hand.push(card);
  }

  private _removeFromHand(card: ICard): ICard | null {
    return removeItemFromArray(this.hand, card);
  }

  getCaravanByCard(card: ICard): ICaravan | null {
    for (const caravan of this.caravans) {
      if (caravan.cards.includes(card)) {
        return caravan;
      }
    }
    return null;
  }

  getValuedCards(): ICard[] {
    return this.hand.filter(card => !card.isFaceCard());
  }

  canDrawCard(): boolean {
    return this.cardSet.getSize() > 0;
  }

  drawCard(): void {
    // Draw a card from the deck and add it to the player's hand
    if (this.canDrawCard()) {
      this._addToHand(this.cardSet.drawCard());
    } else {
      throw new InvalidPlayError("Cannot draw a card from an empty deck");
    }
  }
  drawHand(n: number): void {
    // Draw n cards from the deck and add them to the player's hand
    for (let i = 0; i < n; i++) {
      this.drawCard();
    }
  }

  // Should be named playCardOnCaravan instead
  playCard(card: ICard, caravan: ICaravan): void {
    if (!this.hand.includes(card)) {
      throw new InvalidPlayError("Cannot play a card that is not in the player's hand");
    }
    if (this.isNotOwnCaravan(caravan) && !card.isFaceCard()) {
      throw new InvalidPlayError("Cannot play a valued card to an opponent's caravan");
    }

    // 'Useless' check, but it's here for clarity
    if (caravan.canAddCard(card)) {
      this._removeFromHand(card);
      // REFACTOR: this is being checked twice
      if (this.canDrawCard()) {
        this.drawCard();
      }
    }
    caravan.addCard(card);
  }

  attachFaceCard(faceCard: ICard, targetCard: ICard): void {
    // Verify if face card is in player's hand
    if (!this.hand.includes(faceCard)) {
      throw new InvalidPlayError("Cannot play a face card that is not in the player's hand");
    }

    // You cannot attach a Queen; it must be played to a caravan
    if (faceCard.isFaceCard() && faceCard.value !== "Queen") {
      targetCard.attachFaceCard(faceCard);

      this._removeFromHand(faceCard);
      // REFACTOR: this might be being checked twice
      if (this.canDrawCard()) {
        this.drawCard();
      }
    } else {
      throw new InvalidPlayError("Can only attach Jacks, Kings, and Jokers to cards");
    }
  }

  // This needs to be handled by the Game entity instead (needs knowledge of the match state)
  // playCardOpeningRound(card: ICard, caravan: ICaravan): void {
  //   if (card.isFaceCard()) {
  //     throw new InvalidPlayError("Cannot play a face card in the opening round");
  //   }

  //   return this.playCard(card, caravan);
  // }

  canDisbandCaravan(caravan: ICaravan): boolean {
    if (this.isNotOwnCaravan(caravan)) {
      return false;
    }
    else if (caravan.isEmpty()) {
      return false;
    }
    else {
      return true;
    }
  }

  disbandCaravan(caravan: ICaravan): void {
    if (this.canDisbandCaravan(caravan)) {
      this.discardPile.addCards(caravan.disband());
    } else {
      throw new InvalidPlayError("Cannot disband this caravan; it is not owned by the player or it is empty");
    }
  }

  discardCard(card: ICard): void {
    this.discardPile.addCard(card);
    this._removeFromHand(card);
  }

  isNotOwnCaravan(caravan: ICaravan): boolean {
    return !this.caravans.includes(caravan);
  }

  isOpponentCard(card: ICard): boolean {
    return !this.hand.includes(card);
  }

  // FIXME: this does not consider playing queens to opponent's caravans
  playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean {
    if (this.isOpponentCard(enemyCard)) {
      this._removeFromHand(faceCard);
      // if (faceCard.value === 'Queen') {
      //   // return enemyCaravan.addCard(faceCard);
      //   return enemyCard.attachFaceCard(faceCard);
      // } else {
      return enemyCard.attachFaceCard(faceCard);
      // }
    }
    // throw new Error("This method should only be called when playing a card to an opponent's caravan");
    /* istanbul ignore next */
    return false;
  }

  // REFACTOR: this probably needs to be moved to the Game entity, since it needs visibility of the opponent's caravans
  // Fortunately, this will only adds more lines, and existing lines will not need to be changed
  generatePossibleMoves(isOpeningRound: boolean = true, considerDiscard: boolean = true, considerFaceCards: boolean = true, considerDisbandCaravan: boolean = true): GameAction[] {
    // REFACTOR: split into separate method for opening round
    if (isOpeningRound) {
      considerDiscard = false;
      considerFaceCards = false;
      considerDisbandCaravan = false;
    }

    // Generate a DISCARD_DRAW GameAction for each card in the hand
    const possibleActions: GameAction[] = [];

    if (considerDiscard) {
      for (const card of this.hand) {
        possibleActions.push({
          player: this,
          action: {
            type: "DISCARD_DRAW",
            card,
          }
        });
      }
    }

    // Generate a PLAY_CARD GameAction
    for (const caravan of this.caravans) {
      // Don't add PLAY_CARD actions for non empty caravans in the opening round
      if (isOpeningRound && !caravan.isEmpty()) {
        continue;
      }

      for (const card of this.hand) {
        // For each valued card in the hand (explicitly) that can be played to a caravan
        if (caravan.canAddCard(card) && !card.isFaceCard()) {
          possibleActions.push({
            player: this,
            action: {
              type: "PLAY_CARD",
              card,
              target: caravan
            }
          });
        }

        // FIXME: in the Game entity, also check if the card can be played to the opponent's caravans
        if (considerFaceCards) {
          for (const caravanCard of caravan.cards) {
            // For each face card in the hand that can be attached to a valued card in a caravan
            if (caravanCard.canAttachFaceCard(card)) {
              possibleActions.push({
                player: this,
                action: {
                  type: "PLAY_CARD",
                  card,
                  target: caravanCard
                }
              });
            }
          }
        }
      }
    }

    // Generate a DISBAND_CARAVAN GameAction for each caravan that can be disbanded
    if (considerDisbandCaravan) {
      const disbandableCaravans = this.caravans.filter(caravan => this.canDisbandCaravan(caravan));
      for (const caravan of disbandableCaravans) {
        possibleActions.push({
          player: this,
          action: {
            type: "DISBAND_CARAVAN",
            caravan
          }
        });
      }
    }

    return possibleActions;
  }
}
