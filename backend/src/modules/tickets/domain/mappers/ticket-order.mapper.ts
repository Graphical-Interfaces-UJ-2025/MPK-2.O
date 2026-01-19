import { TicketOrder } from '../entities/ticket-order.entity';
import {
  TicketOrderRecord,
  NewTicketOrderRecord,
} from '../../infrastructure/database/models/ticket-order.model';

export class TicketOrderMapper {
  static toDomain(record: TicketOrderRecord, ticketName?: string): TicketOrder {
    return new TicketOrder(
      record.id,
      record.userId,
      record.ticketId,
      record.validFrom,
      record.validTo,
      record.orderedAt,
      record.price,
      record.isRefunded ?? false,
      ticketName
    );
  }

  static toPersistence(order: TicketOrder): NewTicketOrderRecord {
    return {
      id: order.id,
      userId: order.userId,
      ticketId: order.ticketId,
      validFrom: order.validFrom,
      validTo: order.validTo,
      orderedAt: order.orderedAt,
      price: order.price,
      isRefunded: order.isRefunded,
    };
  }
}
