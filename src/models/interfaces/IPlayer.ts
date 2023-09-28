import { ICard } from './ICard';
import { IDeck } from './IDeck';

export interface IPlayer {
  hand: ICard[];
  cards: ICard[];
  drawCard(deck: IDeck): void;
  // ... any other methods or properties you want all players to have.
}
