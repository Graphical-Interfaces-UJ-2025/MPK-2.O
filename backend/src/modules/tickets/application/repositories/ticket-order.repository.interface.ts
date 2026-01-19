import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface ITicketOrderRepository {
  findById(id: string): Promise<TicketOrder | null>;
  findByUserId(userId: string): Promise<TicketOrder[]>;
  findByUserIdPaginated(
    userId: string,
    pagination: Pagination
  ): Promise<PaginatedResult<TicketOrder>>;
  create(order: TicketOrder): Promise<TicketOrder>;
  update(order: TicketOrder): Promise<TicketOrder>;
  delete(id: string): Promise<void>;
}

export const ITicketOrderRepositoryToken = Symbol('ITicketOrderRepository');
