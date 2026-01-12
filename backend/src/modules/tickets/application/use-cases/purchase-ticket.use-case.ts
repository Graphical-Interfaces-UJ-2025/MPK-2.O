import { inject, injectable } from 'tsyringe';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import {
  ITicketRepository,
  ITicketRepositoryToken,
} from '../repositories/ticket.repository.interface';
import {
  ITicketOrderRepository,
  ITicketOrderRepositoryToken,
} from '../repositories/ticket-order.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { TICKET_ERRORS } from '../../constants';

export interface PurchaseTicketInput {
  userId: string;
  ticketId: string;
  validFrom: Date;
  validTo: Date;
}

@injectable()
export class PurchaseTicketUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(ITicketRepositoryToken) private readonly ticketRepository: ITicketRepository,
    @inject(ITicketOrderRepositoryToken)
    private readonly ticketOrderRepository: ITicketOrderRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(input: PurchaseTicketInput): Promise<TicketOrder> {
    this.logger.info('Processing ticket purchase', {
      userId: input.userId,
      ticketId: input.ticketId,
    });

    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      this.logger.warn('Purchase failed: User not found', { userId: input.userId });
      throw new Error(TICKET_ERRORS.USER_NOT_FOUND);
    }

    const ticket = await this.ticketRepository.findById(input.ticketId);
    if (!ticket) {
      this.logger.warn('Purchase failed: Ticket not found', { ticketId: input.ticketId });
      throw new Error(TICKET_ERRORS.TICKET_NOT_FOUND);
    }

    const price = ticket.currentPrice ?? 0;

    console.log(user.balance, price);
    if (user.balance < price) {
      this.logger.warn('Purchase failed: Insufficient balance', {
        userId: input.userId,
        balance: user.balance,
        price,
      });
      throw new Error(TICKET_ERRORS.INSUFFICIENT_BALANCE);
    }

    const updatedUser = user.deductBalance(price);
    await this.userRepository.update(updatedUser);

    const ticketOrder = new TicketOrder(
      input.userId,
      input.ticketId,
      input.validFrom,
      input.validTo,
      new Date(),
      price,
      ticket.name
    );

    const createdOrder = await this.ticketOrderRepository.create(ticketOrder);

    this.logger.info('Ticket purchase completed successfully', {
      userId: input.userId,
      ticketId: input.ticketId,
      price,
      newBalance: updatedUser.balance,
    });

    return createdOrder;
  }
}
