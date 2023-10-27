/* eslint-disable @typescript-eslint/ban-types */

import { IEventBus, eventType } from "./interfaces/IEventBus";

/**
 * Implementation of the IEventBus interface.
 * Singleton class to manage and handle event subscriptions and publications.
 */
export class EventBus implements IEventBus {
  private static instance: EventBus;
  private listeners: { [event: string]: Function[] } = {};

  /**
   * Private constructor to prevent direct construction calls with the 'new' operator.
   */
  private constructor() { }

  /**
   * Get the instance of EventBus.
   * @returns {EventBus} The singleton instance of EventBus.
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  /**
   * Subscribe to an event.
   * @param event - Type of event to listen for.
   * @param listener - Callback function to be executed when the event is fired.
   */
  subscribe(event: eventType, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  /**
   * Publish (trigger) an event.
   * @param event - Type of event to be triggered.
   * @param args - Arguments to be passed to the subscribed listeners.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publish(event: eventType, ...args: any[]): void {
    (this.listeners[event] || []).forEach(listener => listener(...args));
  }

  /**
   * Clear all event listeners.
   */
  clear(): void {
    this.listeners = {};
  }
}
