import { inject, injectable } from 'tsyringe';
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '../repositories/transaction.repository.interface';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import {
  ITicketOrderRepository,
  ITicketOrderRepositoryToken,
} from '../../../tickets/application/repositories/ticket-order.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { TRANSACTION_ERRORS } from '../../constants';
import { USER_ERRORS } from '../../../user/constants';
import { TICKET_ERRORS } from '../../../tickets/constants';

export interface ProceedTicketRefundInput {
  transactionId: string;
  ticketOrderId: string;
}

@injectable()
export class ProceedTicketRefundUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransactionRepositoryToken)
    private readonly transactionRepository: ITransactionRepository,
    @inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @inject(ITicketOrderRepositoryToken)
    private readonly ticketOrderRepository: ITicketOrderRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  public async execute(input: ProceedTicketRefundInput): Promise<void> {
    this.logger.info('Processing ticket refund', {
      transactionId: input.transactionId,
      ticketOrderId: input.ticketOrderId,
    });

    // Validate transaction exists
    const transaction = await this.transactionRepository.findById(input.transactionId);
    if (!transaction) {
      this.logger.warn('Transaction not found', { transactionId: input.transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND);
    }

    // Validate transaction is of type TICKET_REFUND
    if (transaction.type !== 'TICKET_REFUND') {
      this.logger.warn('Transaction is not a refund', {
        transactionId: input.transactionId,
        type: transaction.type,
      });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_FAILED);
    }

    // Check if transaction is already completed
    if (transaction.status === 'COMPLETED') {
      this.logger.warn('Transaction already completed', { transactionId: input.transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_IS_ALREADY_COMPLETED);
    }

    // Check if transaction has failed
    if (transaction.status === 'FAILED') {
      this.logger.warn('Transaction is failed', { transactionId: input.transactionId });
      throw new Error(TRANSACTION_ERRORS.TRANSACTION_FAILED);
    }

    // Validate user exists
    const user = await this.userRepository.findById(transaction.userId);
    if (!user) {
      this.logger.warn('User not found', { userId: transaction.userId });

      // Mark transaction as failed
      const failedTransaction = transaction.fail();
      await this.transactionRepository.update(failedTransaction);

      throw new Error(USER_ERRORS.USER_NOT_FOUND);
    }

    // Validate ticket order exists
    const ticketOrder = await this.ticketOrderRepository.findById(input.ticketOrderId);
    if (!ticketOrder) {
      this.logger.warn('Ticket order not found', { ticketOrderId: input.ticketOrderId });

      // Mark transaction as failed
      const failedTransaction = transaction.fail();
      await this.transactionRepository.update(failedTransaction);

      throw new Error(TICKET_ERRORS.TICKET_ORDER_NOT_FOUND);
    }

    // Double-check ticket is still refundable (in case time has passed)
    if (!ticketOrder.isRefundable) {
      this.logger.warn('Ticket is no longer refundable', {
        ticketOrderId: input.ticketOrderId,
        elapsedPercentage: ticketOrder.elapsedPercentage,
      });

      // Mark transaction as failed
      const failedTransaction = transaction.fail();
      await this.transactionRepository.update(failedTransaction);

      throw new Error(TICKET_ERRORS.TICKET_NOT_REFUNDABLE);
    }

    // Verify refund amount matches the current refundable price
    const currentRefundablePrice = ticketOrder.refundablePrice;
    if (currentRefundablePrice !== transaction.amount) {
      this.logger.warn('Refund amount mismatch', {
        transactionAmount: transaction.amount,
        currentRefundablePrice,
        ticketOrderId: input.ticketOrderId,
      });

      // Use the current refundable price as it may have decreased
      // This is acceptable as we want to refund the actual current value
    }

    // Add refund amount to user balance
    const updatedUser = user.addBalance(transaction.amount);
    await this.userRepository.update(updatedUser);

    // Mark transaction as completed
    const completedTransaction = transaction.complete();
    await this.transactionRepository.update(completedTransaction);

    // Mark the ticket order as refunded
    const refundedTicketOrder = ticketOrder.markAsRefunded();
    await this.ticketOrderRepository.update(refundedTicketOrder);

    this.logger.info('Ticket refund completed successfully', {
      transactionId: input.transactionId,
      ticketOrderId: input.ticketOrderId,
      userId: transaction.userId,
      refundAmount: transaction.amount,
      newBalance: updatedUser.balance,
    });
  }
}
