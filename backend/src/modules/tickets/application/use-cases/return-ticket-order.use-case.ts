import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import {
  ITicketOrderRepository,
  ITicketOrderRepositoryToken,
} from '../repositories/ticket-order.repository.interface';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import {
  ITransactionRepository,
  ITransactionRepositoryToken,
} from '../../../transactions/application/repositories/transaction.repository.interface';
import {
  IQueueService,
  IQueueServiceToken,
} from '../../../shared/application/services/queue.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Transaction } from '../../../transactions/domain/entities/transaction.entity';
import { TRANSACTION_EVENTS } from '../../../transactions/constants';
import { TICKET_ERRORS } from '../../constants';

export interface ReturnTicketOrderInput {
  userId: string;
  ticketOrderId: string;
}

@injectable()
export class ReturnTicketOrderUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(ITicketOrderRepositoryToken)
    private readonly ticketOrderRepository: ITicketOrderRepository,
    @inject(ITransactionRepositoryToken)
    private readonly transactionRepository: ITransactionRepository,
    @inject(IQueueServiceToken) private readonly queueService: IQueueService,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(input: ReturnTicketOrderInput): Promise<void> {
    this.logger.info('Initiating ticket order return', {
      userId: input.userId,
      ticketOrderId: input.ticketOrderId,
    });

    // Validate user exists
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      this.logger.warn('Return failed: User not found', { userId: input.userId });
      throw new Error(TICKET_ERRORS.USER_NOT_FOUND);
    }

    // Validate ticket order exists
    const ticketOrder = await this.ticketOrderRepository.findById(input.ticketOrderId);
    if (!ticketOrder) {
      this.logger.warn('Return failed: Ticket order not found', {
        ticketOrderId: input.ticketOrderId,
      });
      throw new Error(TICKET_ERRORS.TICKET_ORDER_NOT_FOUND);
    }

    // Validate ticket order belongs to user
    if (ticketOrder.userId !== input.userId) {
      this.logger.warn('Return failed: Ticket order does not belong to user', {
        ticketOrderId: input.ticketOrderId,
        userId: input.userId,
        orderUserId: ticketOrder.userId,
      });
      throw new Error(TICKET_ERRORS.TICKET_ORDER_NOT_FOUND);
    }

    // Validate ticket has price information
    if (!ticketOrder.price) {
      this.logger.warn('Return failed: Ticket order has no price', {
        ticketOrderId: input.ticketOrderId,
      });
      throw new Error(TICKET_ERRORS.TICKET_ORDER_NO_PRICE);
    }

    // Validate ticket is refundable
    if (!ticketOrder.isRefundable) {
      this.logger.warn('Return failed: Ticket is not refundable', {
        ticketOrderId: input.ticketOrderId,
        elapsedPercentage: ticketOrder.elapsedPercentage,
      });
      throw new Error(TICKET_ERRORS.TICKET_NOT_REFUNDABLE);
    }

    const refundAmount = ticketOrder.refundablePrice;

    if (refundAmount <= 0) {
      this.logger.warn('Return failed: Refund amount is zero or negative', {
        ticketOrderId: input.ticketOrderId,
        refundAmount,
      });
      throw new Error(TICKET_ERRORS.TICKET_NOT_REFUNDABLE);
    }

    // Create refund transaction
    const transaction = Transaction.create(
      uuidv4(),
      input.userId,
      'TICKET_REFUND',
      refundAmount,
      ticketOrder.ticketId,
      'PENDING'
    );

    await this.transactionRepository.create(transaction);

    // Emit refund initiated event for async processing
    await this.queueService.emit(TRANSACTION_EVENTS.REFUND_INITIATED, {
      transactionId: transaction.id,
      ticketOrderId: input.ticketOrderId,
    });

    this.logger.info('Ticket return initiated successfully', {
      userId: input.userId,
      ticketOrderId: input.ticketOrderId,
      transactionId: transaction.id,
      refundAmount,
      elapsedPercentage: ticketOrder.elapsedPercentage,
    });
  }
}
