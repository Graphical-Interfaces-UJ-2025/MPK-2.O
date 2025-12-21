import { inject, injectable } from 'tsyringe';
import {
  ITicketOrderRepository,
  ITicketOrderRepositoryToken,
} from '../repositories/ticket-order.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { TicketOrder } from '../../domain/entities/ticket-order.entity';

@injectable()
export class GetOrderHistoryUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITicketOrderRepositoryToken) private ticketOrderRepository: ITicketOrderRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child('GetOrderHistoryUseCase');
  }

  async execute(userId: string): Promise<TicketOrder[]> {
    this.logger.info('Getting order history for user', { userId });

    const orders = await this.ticketOrderRepository.findByUserId(userId);

    this.logger.info('Order history retrieved successfully', {
      userId,
      orderCount: orders.length,
    });

    return orders;
  }
}
