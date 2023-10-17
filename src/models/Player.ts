import { InvalidPlayError } from "../exceptions/GameExceptions";
import { removeItemFromArray } from "../utils/array";
import { Caravan } from "./Caravan";
import { Deck } from "./Deck";
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
  }

  private _addToHand(card: ICard): void {
    this.hand.push(card);
  }

  private _removeFromHand(card: ICard): ICard | null {
    return removeItemFromArray(this.hand, card);
  };

  getValuedCards(): ICard[] {
    return this.hand.filter(card => !card.isFaceCard());
  }

  drawCard(): void {
    // Draw a card from the deck and add it to the player's hand
    if (this.cardSet.getSize() === 0) {
      throw new InvalidPlayError("Cannot draw a card from an empty deck");
    } else {
    this._addToHand(this.cardSet.drawCard());
    }
  }
  drawHand(n: number): void {
    // Draw n cards from the deck and add them to the player's hand
    for (let i = 0; i < n; i++) {
      this.drawCard();
    }
  }

  // Should be named playCardToCaravan instead
  playCard(card: ICard, caravan: ICaravan): void {
    if (!this.hand.includes(card)) {
      throw new InvalidPlayError("Cannot play a card that is not in the player's hand");
    }
    if (this.isNotOwnCaravan(caravan) && !card.isFaceCard()) {
      throw new InvalidPlayError("Cannot play a valued card to an opponent's caravan");
    }

    // 'Useless' check, but it's here for clarity
    if (caravan.canAddCard(card)) {
      this._removeFromHand(card)
      this.drawCard();
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

  generatePossibleMoves(): GameAction[] {
    // Generate a DISCARD_DRAW GameAction for each card in the hand
    const possibleActions: GameAction[] = [];

    for (const card of this.hand) {
      possibleActions.push({
        player: this,
        action: {
          type: "DISCARD_DRAW",
          card,
        }
      });
    }

    // TODO: Generate a PLAY_CARD GameAction for each valued card in the hand for each caravan where the card can be played

    // TODO: Generate a DISBAND_CARAVAN GameAction for each caravan that can be disbanded

    return possibleActions;
  }
}
