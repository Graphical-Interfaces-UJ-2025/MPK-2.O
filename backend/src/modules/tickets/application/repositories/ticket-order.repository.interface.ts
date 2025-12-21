import { TicketOrder } from '../../domain/entities/ticket-order.entity';

export interface ITicketOrderRepository {
  findByUserId(userId: string): Promise<TicketOrder[]>;
}

export const ITicketOrderRepositoryToken = Symbol('ITicketOrderRepository');
