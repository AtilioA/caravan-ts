import { ICaravan } from "./ICaravan";
import { ICard } from "./ICard";
import { IDeck } from "./IDeck";
import { GameAction } from "./IGame";

/**
 * Represents the interface for a player in a game.
 */
export interface IPlayer {
  /** Represents the current set of cards in the player's hand. */
  hand: ICard[];

  /** Represents the complete set of cards assigned to the player. */
  cardSet: IDeck;

  /** Represents the pile of discarded cards of the player. */
  discardPile: IDeck;

  /** Represents the caravans owned by the player. */
  caravans: ICaravan[];

  // TODO: (future improvement) add a general pile of cards from which to create the player's deck

  /**
   * Determines if a card can be drawn from the player's card set.
   * @returns true if the card can be drawn; otherwise, false.
   */
  canDrawCard(): boolean;

  /**
   * Draws a card from the player's card set and adds it to the hand.
   * @throws InvalidPlayError if the player's card set is empty.
   */
  drawCard(): void;

  /**
   * Draws multiple cards from the player's card set and adds them to the hand.
   * @param n - The number of cards to be drawn.
   */
  drawHand(n: number): void;

  /**
   * Fetches all the valued cards (excluding face cards) from the player's hand.
   * @returns An array of valued cards.
   */
  getValuedCards(): ICard[];

  /**
   * Fetches the caravan that contains the specified card.
   * @param card - The card to be checked.
   * @returns The caravan containing the card, or null if not found.
   */
  getCaravanByCard(card: ICard): ICaravan | null;

  /**
   * Allows the player to play a card on a specified caravan.
   * @param card - The card to be played.
   * @param caravan - The caravan on which the card is to be played.
   * @throws InvalidPlayError if the card is not in the player's hand, or if the card is not a valued card and is played on an opponent's caravan.
   */
  playCard(card: ICard, caravan: ICaravan): void;

  /**
   * Allows the player to attach a face card to a target card.
   * @param faceCard - The face card to be attached.
   * @param targetCard - The target card to which the face card is attached.
   * @throws InvalidPlayError if the face card is not in the player's hand, or if faceCard is not an attachable face card.
   */
  attachFaceCard(faceCard: ICard, targetCard: ICard): void;

  /**
   * Allows the player to discard a card.
   * @param card - The card to be discarded.
   */
  discardCard(card: ICard): void;

  /**
   * Allows the player to play a face card on an opponent's caravan card.
   * @param faceCard - The face card to be played.
   * @param enemyCard - The opponent's card on which the face card is to be played.
   * @returns true if the face card can be played on the opponent's card; otherwise, false.
   */
  playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean;

  /**
   * Determines if a caravan does not belong to the player.
   * @param caravan - The caravan to be checked.
   * @returns true if the caravan does not belong to the player; otherwise, false.
   */
  isNotOwnCaravan(caravan: ICaravan): boolean;

  /**
   * Determines if a caravan can be disbanded by the player.
   * @param caravan - The caravan to be checked.
   * @returns true if the caravan can be disbanded; otherwise, false.
   */
  canDisbandCaravan(caravan: ICaravan): boolean;

  /**
   * Allows the player to disband a caravan.
   * @param caravan - The caravan to be disbanded.
   * @throws InvalidPlayError if the caravan does not belong to the player, or if the caravan is empty.
   */
  disbandCaravan(caravan: ICaravan): void;

  // REVIEW: modularize this later on?
  /**
   * Generates a list of possible actions or moves that a player can perform.
   * @param isOpeningRound - (optional) Indicates if it's the opening round of the game. Defaults to true. Note that setting this to true will ignore the other parameters.
   * @param considerDiscard - (optional) Indicates if discarding should be considered. Defaults to true.
   * @param considerFaceCards - (optional) Indicates if face cards should be considered. Defaults to true.
   * @param considerDisbandCaravan - (optional) Indicates if disbanding caravan should be considered. Defaults to true.
   * @returns An array of possible game actions.
   */
  generatePossibleMoves(isOpeningRound?: boolean, considerDiscard?: boolean, considerFaceCards?: boolean, considerDisbandCaravan?: boolean): GameAction[];
}
