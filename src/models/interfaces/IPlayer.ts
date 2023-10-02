import { ICaravan } from './ICaravan';
import { ICard } from './ICard';
import { IDeck } from './IDeck';

export interface IPlayer {
  hand: ICard[];
  cardSet: IDeck;
  // TODO: add a general pile of cards from which to create the player's deck

  drawCard(): void;
  drawHand(n: number): void;

  playCard(card: ICard, caravan: ICaravan): void;
  discardCard(card: ICard): void;

  determineOpponentCaravan(caravan: ICaravan): void;
  playCardToOpponentCaravan(card: ICard, enemyCaravan: ICaravan): void;
}
