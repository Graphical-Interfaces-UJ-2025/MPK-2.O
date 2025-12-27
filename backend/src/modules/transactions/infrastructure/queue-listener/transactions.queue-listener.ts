import { container } from 'tsyringe';
import {
  IQueueService,
  IQueueServiceToken,
} from '../../../shared/application/services/queue.interface';
import { ProceedBalanceRechargeUseCase } from '../../application/use-cases/proceed-balance-recharge.use-case';
import { TRANSACTION_EVENTS } from '../../constants';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';

export const registerTransactionsQueueListener = () => {
  const logger = container.resolve<ILogger>(ILoggerToken).child('TransactionsQueueListener');
  const queueService: IQueueService = container.resolve(IQueueServiceToken);
  const proceedBalanceRechargeUseCase = container.resolve(ProceedBalanceRechargeUseCase);

  queueService.on<{ transactionId: string }>(
    TRANSACTION_EVENTS.RECHARGE_INITIATED,
    async (event) => {
      const { transactionId } = event.payload;

      logger.info('Processing recharge initiated event', {
        transactionId,
        eventName: event.name,
        timestamp: event.timestamp,
      });

      try {
        await proceedBalanceRechargeUseCase.execute(transactionId);

        logger.info('Recharge processed successfully', { transactionId });
      } catch (error) {
        logger.error('Failed to process recharge', {
          transactionId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  logger.info('Transaction queue listeners registered', {
    events: [TRANSACTION_EVENTS.RECHARGE_INITIATED],
  });
};
