import { TicketPrice } from '../../domain/entities/ticket-price.entity';

export interface ITicketPriceRepository {
  findCurrentByTicketId(ticketId: string): Promise<TicketPrice | null>;
  findByTicketIdAtTime(ticketId: string, time: Date): Promise<TicketPrice | null>;
  create(ticketPrice: TicketPrice): Promise<TicketPrice>;
}

export const ITicketPriceRepositoryToken = Symbol('ITicketPriceRepository');
