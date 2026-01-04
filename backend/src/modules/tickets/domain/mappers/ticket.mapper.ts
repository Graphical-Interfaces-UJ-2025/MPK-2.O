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
      {
        value: record.validTimeValue,
        unit: record.validTimeUnit,
      },
      currentPrice
    );
  }

  static toPersistence(ticket: Ticket): NewTicketRecord {
    return {
      id: ticket.id,
      name: ticket.name,
      validTimeValue: ticket.validTime.value,
      validTimeUnit: ticket.validTime.unit,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      deletedAt: ticket.deletedAt,
    };
  }
}
