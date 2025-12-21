import { Ticket } from '../../domain/entities/ticket.entity';

export interface ITicketRepository {
  findById(id: string): Promise<Ticket | null>;
  findByIdIncludeDeleted(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  findAllIncludeDeleted(): Promise<Ticket[]>;
  create(ticket: Ticket): Promise<Ticket>;
  softDelete(id: string): Promise<void>;
}

export const ITicketRepositoryToken = Symbol('ITicketRepository');
