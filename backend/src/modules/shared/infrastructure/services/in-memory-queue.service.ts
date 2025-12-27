import { EventEmitter } from 'events';
import { injectable } from 'tsyringe';
import {
  IQueueService,
  QueueEvent,
  EventHandler,
} from '../../application/services/queue.interface';

@injectable()
export class InMemoryQueueService implements IQueueService {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
  }

  async emit<T>(eventName: string, payload: T): Promise<void> {
    const event: QueueEvent<T> = {
      name: eventName,
      payload,
      timestamp: new Date(),
    };
    this.emitter.emit(eventName, event);
  }

  on<T>(eventName: string, handler: EventHandler<T>): void {
    this.emitter.on(eventName, handler);
  }

  once<T>(eventName: string, handler: EventHandler<T>): void {
    this.emitter.once(eventName, handler);
  }

  off<T>(eventName: string, handler: EventHandler<T>): void {
    this.emitter.off(eventName, handler);
  }

  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.emitter.removeAllListeners(eventName);
    } else {
      this.emitter.removeAllListeners();
    }
  }
}
