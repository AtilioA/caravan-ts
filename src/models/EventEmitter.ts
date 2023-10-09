import { IEventEmitter, eventType } from "./interfaces/IEventEmitter";

export class EventEmitter implements IEventEmitter {
  events: { [event in eventType]?: Function[] } = {};

  // Registers a listener for the specified event.
  //
  // Events:
  //   'event' - The name of the event to listen for.
  //   'listener' - The listener function to call when the event occurs.
  on(event: eventType, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(listener);
  }

  // Emits an event to all listeners.
  //
  // event: The event to emit.
  // ...args: Any additional arguments to pass to the listeners.
  emit(event: eventType, ...args: any[]): void {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }

  // Removes the given listener from the given event.
  // If the listener is not registered for the given event, this method does nothing.
  removeListener(event: eventType, listener: Function): void {
    const listeners = this.events[event];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
