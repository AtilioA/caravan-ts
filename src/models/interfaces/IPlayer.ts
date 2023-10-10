import { ICaravan } from './ICaravan';
import { ICard } from './ICard';
import { IDeck } from './IDeck';

export interface IPlayer {
  hand: ICard[];
  cardSet: IDeck;
  discardPile: IDeck;
  caravans: ICaravan[];
  // TODO: (future improvement) add a general pile of cards from which to create the player's deck

  drawCard(): void;
  drawHand(n: number): void;

  playCard(card: ICard, caravan: ICaravan): void;
  discardCard(card: ICard): void;
  disbandCaravan(caravan: ICaravan): void;

  isOpponentCaravan(caravan: ICaravan): boolean;
  playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean;
}
