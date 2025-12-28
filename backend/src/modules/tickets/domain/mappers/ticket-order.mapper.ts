import { TicketOrder } from '../entities/ticket-order.entity';
import {
  TicketOrderRecord,
  NewTicketOrderRecord,
} from '../../infrastructure/database/models/ticket-order.model';

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

  static toPersistence(order: TicketOrder): NewTicketOrderRecord {
    return {
      userId: order.userId,
      ticketId: order.ticketId,
      validFrom: order.validFrom,
      validTo: order.validTo,
      concessionId: order.concessionId,
      orderedAt: order.orderedAt,
      price: order.price,
    };
  }
}
