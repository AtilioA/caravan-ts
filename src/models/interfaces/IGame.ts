import { AIStrategy } from "./AIStrategy";
import { ICaravan } from "./ICaravan";
import { ICard } from "./ICard";
import { IEventBus } from "./IEventBus";
import { IPlayer } from "./IPlayer";

/**
 * Represents an action a player can perform during their turn in the game.
 */
export type PlayerAction =
  /**
   * Represents playing a card against another card or a caravan.
   */
  | { type: "PLAY_CARD", card: ICard, target: ICard | ICaravan }
  /**
   * Represents the action to disband a caravan.
   */
  | { type: "DISBAND_CARAVAN", caravan: ICaravan }
  /**
   * Represents the action to discard a card and potentially draw a new one.
   */
  | { type: "DISCARD_DRAW", card: ICard };

/**
 * Represents a game action performed by a player.
 * It captures both the player making the action and the action itself.
 */
export interface GameAction {
  /** The Player who performs the action. */
  player: IPlayer;
  /** The action performed by the Player. */
  action: PlayerAction;
}

/**
 * Represents the state of the game at any given moment.
 * It includes references to both human and AI players, the current player's index, and whether the game is in its opening round.
 */
export interface GameState {
  /** The humanPlayer player. */
  humanPlayer: IPlayer;
  /** The AI player. */
  AIPlayer: IPlayer;
  /** The index of the current player. */
  currentPlayerIndex: number;
  /** Whether the game is in its opening rounds. */
  isOpeningRound: boolean;
}

/**
 * Defines the main Game interface.
 * It includes information about the current game state, the players involved, events, and other game-related properties and methods.
 * It is responsible for coordinating the game's flow and ensuring that the overarching game rules are followed.
 */
export interface IGame {
  /** Whether the game is over. */
  isOver: boolean;
  /** The array of players involved in the game. */
  players: IPlayer[];
  /** The number of rounds played so far. */
  currentRound: number;
  /** Whether the game is in its opening rounds. */
  isOpeningRound: boolean;
  /** The index of the current player. */
  currentPlayerIndex: number;
  /** The AI strategy to use for the game. */
  currentAIStrategy: AIStrategy | null;
  /** The event bus used to publish events. */
  events: IEventBus;

  /**
   * Returns the current state of the game.
   * @returns The current state of the game.
   */
  getCurrentGameState(): GameState;

  /**
   * Allows an AI strategy to be set for the Game instance. This strategy will be used to determine the AI's moves.
   * @param strategy - The AI strategy to use for the game.
   */
  setAIStrategy(strategy: AIStrategy): void;

  /**
   * Begins a new game session. Ensures that game conditions are met (e.g. correct number of players, proper card set size).
   * If the conditions aren't met, appropriate invalidGameState events will be published.
   * Once the game starts, each player's deck is shuffled and they're given an initial hand.
   */
  start(): void;

  /**
   * Returns the player whose turn it is.
   * @returns The player whose turn it is.
   */
  getCurrentPlayer(): IPlayer;

  /**
   * Executes the given play for the current turn, taking into account the state of the game.
   * If the game is in its opening round, a different set of actions is executed.
   * Otherwise, depending on the action type of the play, different game procedures will take place.
   * If any game rules are violated, appropriate events will be published.
   *
   * @param play - The game action representing the play the current player wants to make.
   */
  playTurn(action: GameAction): void;

  /**
   * Pick an AI move based on the current AI strategy and play it for the current turn. Opening turns are also handled.
   * If no AI strategy is set, an invalidGameState event will be published.
   */
  nextAIMove(): void;

  /**
   * Checks if any player meets the winning conditions for the game.
   * Initially, it checks if any player has a sold caravan. If not, it checks if any player is out of cards.
   *
   * @returns The player who won, or null if no one has won yet.
   */
  checkForWinner(): IPlayer | null;

  /**
   * Ends the current Caravan match, setting the game's state as over.
   * All entities will be unsubscribed from the event bus (WIP).
   */
  end(): void;
}
