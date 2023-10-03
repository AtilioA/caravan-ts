export class CardNotInHandError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = CardNotInHandError.name;
  }
}

export class InvalidPlayError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = InvalidPlayError.name;
  }
}
