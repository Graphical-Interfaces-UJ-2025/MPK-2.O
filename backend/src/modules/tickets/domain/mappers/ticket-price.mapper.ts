import { TicketPrice } from '../entities/ticket-price.entity';
import {
  TicketPriceRecord,
  NewTicketPriceRecord,
} from '../../infrastructure/database/models/ticket-price.model';

export class TicketPriceMapper {
  static toDomain(record: TicketPriceRecord): TicketPrice {
    return new TicketPrice(
      record.id,
      record.ticketId,
      record.price,
      record.validFrom,
      record.validTo
    );
  }

  static toPersistence(ticketPrice: TicketPrice): Omit<NewTicketPriceRecord, 'id'> {
    return {
      ticketId: ticketPrice.ticketId,
      price: ticketPrice.price,
      validFrom: ticketPrice.validFrom,
      validTo: ticketPrice.validTo,
    };
  }
}
