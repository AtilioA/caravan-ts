import { Deck } from "./Deck";
import { ICaravan } from "./interfaces/ICaravan";
import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";
import { IPlayer } from "./interfaces/IPlayer";

export class Player implements IPlayer {
  cardSet: IDeck = new Deck();
  hand: ICard[] = [];

  constructor(cardSet: IDeck = new Deck(), hand: ICard[] = []) {
    this.cardSet = cardSet;
    this.hand = hand;
  }

  private _addToHand(card: ICard): void {
    this.hand.push(card);
  }

  drawCard(): void {
    // Draw a card from the deck and add it to the player's hand
    this._addToHand(this.cardSet.drawCard());
  }
  drawHand(n: number): void {}

  playCard(card: ICard, caravan: ICaravan): void {}
  discardCard(card: ICard): void {
    const cardIndex = this.hand.indexOf(card);
    this.hand.splice(cardIndex, 1);
  }


  determineOpponentCaravan(caravan: ICaravan): boolean {
    return false;
  }
  playCardToOpponentCaravan(card: ICard, enemyCaravan: ICaravan): void {}

}
