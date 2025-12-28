import { inject, injectable } from 'tsyringe';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import {
  ITicketOrderRepository,
  ITicketOrderRepositoryToken,
} from '../repositories/ticket-order.repository.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { TICKET_ERRORS } from '../../constants';

@injectable()
export class GetUserTicketOrdersHistoryUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(ITicketOrderRepositoryToken)
    private readonly ticketOrderRepository: ITicketOrderRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(userId: string, pagination: Pagination): Promise<PaginatedResult<TicketOrder>> {
    this.logger.info('Fetching user ticket orders history', { userId });

    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.warn('User not found', { userId });
      throw new Error(TICKET_ERRORS.USER_NOT_FOUND);
    }

    const result = await this.ticketOrderRepository.findByUserIdPaginated(userId, pagination);

    this.logger.info('User ticket orders history fetched successfully', {
      userId,
      total: result.total,
      page: result.page,
    });

    return result;
  }
}
