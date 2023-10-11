export class InvalidPlayError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = InvalidPlayError.name;
  }
}

export class InvalidGameState extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = InvalidGameState.name;
  }
}
