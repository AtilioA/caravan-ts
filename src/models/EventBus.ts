import { IEventBus, eventType } from "./interfaces/IEventBus";

export class EventBus implements IEventBus {
  private static instance: EventBus;
  private listeners: { [event: string]: Function[] } = {};

  private constructor() { } // private constructor to prevent direct construction calls with the 'new' operator.

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  subscribe(event: eventType, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  publish(event: eventType, ...args: any[]): void {
    (this.listeners[event] || []).forEach(listener => listener(...args));
  }

  clear(): void {
    this.listeners = {};
  }
}
