import { container } from 'tsyringe';
import { registerTransactionsQueueListener } from '../../../transactions/infrastructure/queue-listener/transactions.queue-listener';
import { ILogger, ILoggerToken } from '../../application/services/logger.interface';

let listenersRegistered = false;

export const registerAppEventListeners = () => {
  if (listenersRegistered) {
    return;
  }

  const logger = container.resolve<ILogger>(ILoggerToken).child('AppEventListeners');

  logger.info('Initializing application event listeners');

  try {
    registerTransactionsQueueListener();

    listenersRegistered = true;
    logger.info('All application event listeners registered successfully');
  } catch (error) {
    logger.error('Failed to register event listeners', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
