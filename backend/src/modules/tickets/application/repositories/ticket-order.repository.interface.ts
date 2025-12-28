import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface ITicketOrderRepository {
  findByUserId(userId: string): Promise<TicketOrder[]>;
  findByUserIdPaginated(userId: string, pagination: Pagination): Promise<PaginatedResult<TicketOrder>>;
  create(order: TicketOrder): Promise<TicketOrder>;
}

export const ITicketOrderRepositoryToken = Symbol('ITicketOrderRepository');
