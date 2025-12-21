import { TicketOrder } from '../entities/ticket-order.entity';
import { TicketOrderRecord } from '../../infrastructure/database/models/ticket-order.model';

export class TicketOrderMapper {
  static toDomain(record: TicketOrderRecord, ticketName?: string): TicketOrder {
    return new TicketOrder(
      record.userId,
      record.ticketId,
      record.validFrom,
      record.validTo,
      record.concessionId,
      record.orderedAt,
      record.price,
      ticketName
    );
  }
}
