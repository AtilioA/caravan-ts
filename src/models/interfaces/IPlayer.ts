import { ICard } from './ICard';
import { IDeck } from './IDeck';

export interface IPlayer {
  hand: ICard[];
  cardSet: IDeck;
  // TODO: add a general pile of cards from which to create the player's deck

  drawCard(deck: IDeck): void;
  // ... any other methods or properties you want all players to have.
}
