export type eventType =
  | "gameStarted"
  | "drawInitialCards"
  | "endTurn"
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

export interface IEventBus {
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: eventType, listener: Function): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publish(event: eventType, ...args: any[]): void;
  clear(): void;
}
