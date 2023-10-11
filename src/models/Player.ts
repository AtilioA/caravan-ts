import { InvalidPlayError } from "../exceptions/GameExceptions";
import { removeItemFromArray } from "../utils/array";
import { Caravan } from "./Caravan";
import { Deck } from "./Deck";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";
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
    if (this.isOpponentCaravan(caravan) && !card.isFaceCard()) {
      throw new InvalidPlayError("Cannot play a valued card to an opponent's caravan");
    }

    this._removeFromHand(card)
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

  disbandCaravan(caravan: ICaravan): void {
    if (!this.caravans.includes(caravan)) {
      throw new InvalidPlayError("Cannot disband a caravan that does not belong to the player");
    }
    if (caravan.cards.length === 0) {
      throw new InvalidPlayError("Cannot disband an empty caravan");
    }

    this.discardPile.addCards(caravan.disband());
  }

  discardCard(card: ICard): void {
    this.discardPile.addCard(card);
    this._removeFromHand(card);
  }

  isOpponentCaravan(caravan: ICaravan): boolean {
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
}
