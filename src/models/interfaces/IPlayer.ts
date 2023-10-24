import { ICaravan } from './ICaravan';
import { ICard } from './ICard';
import { IDeck } from './IDeck';
import { GameAction } from './IGame';

export interface IPlayer {
  hand: ICard[];
  cardSet: IDeck;
  discardPile: IDeck;
  caravans: ICaravan[];
  // TODO: (future improvement) add a general pile of cards from which to create the player's deck

  canDrawCard(): boolean;
  drawCard(): void;
  drawHand(n: number): void;
  getValuedCards(): ICard[];
  getCaravanByCard(card: ICard): ICaravan | null;

  playCard(card: ICard, caravan: ICaravan): void;
  attachFaceCard(faceCard: ICard, targetCard: ICard): void;
  discardCard(card: ICard): void;

  playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean;
  isNotOwnCaravan(caravan: ICaravan): boolean;
  canDisbandCaravan(caravan: ICaravan): boolean;
  disbandCaravan(caravan: ICaravan): void;

  // REFACTOR: modularize this later on?
  generatePossibleMoves(isOpeningRound?: boolean, considerDiscard?: boolean, considerFaceCards?: boolean, considerDisbandCaravan?: boolean): GameAction[];
}
