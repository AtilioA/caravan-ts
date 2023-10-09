export type eventType =
  | 'startGame'
  | "drawInitialCards"
  | "reshuffleAndDraw"  // When reshuffling due to a lack of number cards
  | "playCardOnCaravan" // Includes details about which caravan with which card
  | "playCardOnCard"    // Includes details about which card was targeted with which card
  | "discardCard"       // Includes details about the card discarded
  | "disbandCaravan"    // Which caravan was disbanded
  | "playJokerOnAce"    // Details about which ace (suit) and the effect
  | "playJokerOnNumber" // Details about which number and the effect
  | "playJack"          // Details about which card was targeted
  | "playQueen"         // Details about which card was targeted and its effects (direction and suit change)
  | "playKing"          // Details about which card was targeted and its effects (value added)
  | "caravanSold"       // Which caravan was sold and its value
  | "opponentOutOfCards"
  | "trackTied"         // When a caravan track reaches a tie
  | "disbandTiedTrack"  // When a tied caravan track is disbanded
  | "sabotageOpponentCaravan" // This could be a more general event that occurs when an action specifically targets the opponent's caravan
  | "gameOver"          // Details about the winner and the final state of caravans
  | "invalidPlay"       // Details about the invalid play
  ;

export interface IEventEmitter {
  events: { [event in eventType]?: Function[] };

  on(event: eventType, listener: Function): void;
  emit(event: eventType, ...args: any[]): void;
  removeListener(event: eventType, listener: Function): void;
}
