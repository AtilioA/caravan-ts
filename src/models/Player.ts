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

  private removeFromHand(card: ICard): ICard | null {
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

  playCard(card: ICard, caravan: ICaravan): void {
    if (!this.hand.includes(card)) {
      throw new InvalidPlayError("Cannot play a card that is not in the player's hand");
    }
    if (this.isOpponentCaravan(caravan) && !card.isFaceCard()) {
      throw new InvalidPlayError("Cannot play a valued card to an opponent's caravan");
    }

    this.removeFromHand(card)
    caravan.addCard(card);
  }

  discardCard(card: ICard): void {
    this.removeFromHand(card);
  }

  isOpponentCaravan(caravan: ICaravan): boolean {
    // Should be enough, since Array.prototype.includes method uses strict equality (===) to determine if an element exists in the array.
    return !this.caravans.includes(caravan);
  }

  isOpponentCard(card: ICard): boolean {
    return !this.hand.includes(card);
  }

  playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean {
    // Should be enough, since Array.prototype.includes method uses strict equality (===) to determine if an element exists in the array.
    if (this.isOpponentCard(enemyCard)) {
      this.removeFromHand(faceCard);
      return enemyCard.attachFaceCard(faceCard);
    }
    else {
      throw new InvalidPlayError("Cannot play a face card to an opponent's caravan's card");
    }
  }
}
