import { ICard } from './interfaces/ICard';

export class Card implements ICard {
  constructor(public value: string, public suit: string) {}
  // leave methods unimplemented for now
}
