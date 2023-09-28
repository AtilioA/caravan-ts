import { ICard } from "./interfaces/ICard";
import { IDeck } from "./interfaces/IDeck";
import { IPlayer } from "./interfaces/IPlayer";

export class Player implements IPlayer {
  constructor(public hand: ICard[] = [],
              public cards: ICard[] = []) {}

  drawCard(deck: IDeck): void {
    // leave unimplemented for now
    throw new Error("Method not implemented.");
  }
}
