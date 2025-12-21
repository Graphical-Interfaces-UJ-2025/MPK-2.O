import { Ticket } from '../entities/ticket.entity';
import { TicketRecord, NewTicketRecord } from '../../infrastructure/database/models/ticket.model';

export class TicketMapper {
  static toDomain(record: TicketRecord, currentPrice?: number): Ticket {
    return new Ticket(
      record.id,
      record.name,
      record.createdAt,
      record.updatedAt,
      record.deletedAt,
      currentPrice
    );
  }

  static toPersistence(ticket: Ticket): NewTicketRecord {
    return {
      id: ticket.id,
      name: ticket.name,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      deletedAt: ticket.deletedAt,
    };
  }
}
