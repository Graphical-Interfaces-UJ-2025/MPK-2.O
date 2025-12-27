export interface QueueEvent<T = unknown> {
  name: string;
  payload: T;
  timestamp: Date;
}

export type EventHandler<T = unknown> = (event: QueueEvent<T>) => Promise<void> | void;

export interface IQueueService {
  /**
   * Emit an event to the queue
   * @param eventName - The name of the event
   * @param payload - The event payload
   */
  emit<T>(eventName: string, payload: T): Promise<void>;

  /**
   * Register a listener for an event
   * @param eventName - The name of the event to listen for
   * @param handler - The handler function to call when the event is emitted
   */
  on<T>(eventName: string, handler: EventHandler<T>): void;

  /**
   * Register a one-time listener for an event
   * @param eventName - The name of the event to listen for
   * @param handler - The handler function to call when the event is emitted
   */
  once<T>(eventName: string, handler: EventHandler<T>): void;

  /**
   * Remove a listener for an event
   * @param eventName - The name of the event
   * @param handler - The handler function to remove
   */
  off<T>(eventName: string, handler: EventHandler<T>): void;

  /**
   * Remove all listeners for an event, or all listeners if no event name is provided
   * @param eventName - Optional event name
   */
  removeAllListeners(eventName?: string): void;
}

export const IQueueServiceToken = Symbol('IQueueService');
