/**
 * Represents various events that can occur during a game.
 */
export type eventType =
  | "gameStarted"
  | "drawInitialCards"
  | "endTurn"
  | "cardDiscarded"           // Includes details about the card discarded and the caravan it was discarded from
  | "nextTurn"                // Includes details about the next player
  | "playCardOnCaravan"       // Includes details about which caravan with which card
  | "playCardOnCard"          // Includes details about which card was targeted with which card
  | "discardCard"             // Includes details about the card discarded
  | "disbandCaravan"          // Which caravan was disbanded
  | "updateCaravanBid"        // Which caravan should be updated
  | "updateCaravansBids"
  | "playJokerOnAce"          // Details about which ace (suit) and the effect
  | "playJokerOnNumber"       // Details about which number and the effect
  | "playJack"                // Details about which card was targeted
  | "playQueen"               // Details about which card was targeted and its effects (direction and suit change)
  | "playKing"                // Details about which card was targeted and its effects (value added)
  | "caravanSold"             // Which caravan was sold and its value
  | "opponentOutOfCards"
  | "trackTied"               // When a caravan track reaches a tie
  | "disbandTiedTrack"        // When a tied caravan track is disbanded
  | "sabotageOpponentCaravan" // This could be a more general event that occurs when an action specifically targets the opponent's caravan
  | "gameOver"                // Details about the winner and the final state of caravans
  | "invalidGameState"        // Details about the invalid game state
  | "invalidPlay"             // Details about the invalid play
  ;

/**
 * Interface for the event bus system.
 */
export interface IEventBus {
  /**
   * Subscribe to an event.
   * @param event - Type of event to listen for.
   * @param listener - Callback function to be executed when the event is fired.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: eventType, listener: Function): void;

  /**
   * Publish (trigger) an event.
   * @param event - Type of event to be triggered.
   * @param args - Arguments to be passed to the subscribed listeners.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publish(event: eventType, ...args: any[]): void;

  /**
   * Clear all event listeners.
   */
  clear(): void;
}
