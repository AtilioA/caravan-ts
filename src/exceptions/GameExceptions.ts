/**
 * Custom error class representing an invalid play in the game.
 */
export class InvalidPlayError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = InvalidPlayError.name;
  }
}

/**
 * Custom error class representing an invalid game state.
 */
export class InvalidGameState extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = InvalidGameState.name;
  }
}
