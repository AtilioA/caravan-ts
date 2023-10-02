import { Deck } from "./Deck";
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

  drawCard(deck: IDeck): void {
    // Draw a card from the deck and add it to the player's hand
    this._addToHand(this.cardSet.drawCard());
  }
}
