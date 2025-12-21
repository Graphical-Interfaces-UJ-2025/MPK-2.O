import { injectable } from 'tsyringe';
import { eq, and, lte, or, isNull, gt } from 'drizzle-orm';
import { ITicketPriceRepository } from '../../application/repositories/ticket-price.repository.interface';
import { TicketPrice } from '../../domain/entities/ticket-price.entity';
import { ticketPrice } from '../database/models/ticket-price.model';
import { TicketPriceMapper } from '../../domain/mappers/ticket-price.mapper';
import { db } from '../../../../config/database.config';

@injectable()
export class TicketPriceRepository implements ITicketPriceRepository {
  async findCurrentByTicketId(ticketId: string): Promise<TicketPrice | null> {
    const now = new Date();
    const [record] = await db
      .select()
      .from(ticketPrice)
      .where(
        and(
          eq(ticketPrice.ticketId, ticketId),
          lte(ticketPrice.validFrom, now),
          or(isNull(ticketPrice.validTo), gt(ticketPrice.validTo, now))
        )
      )
      .limit(1);

    return record ? TicketPriceMapper.toDomain(record) : null;
  }

  async findByTicketIdAtTime(ticketId: string, time: Date): Promise<TicketPrice | null> {
    const [record] = await db
      .select()
      .from(ticketPrice)
      .where(
        and(
          eq(ticketPrice.ticketId, ticketId),
          lte(ticketPrice.validFrom, time),
          or(isNull(ticketPrice.validTo), gt(ticketPrice.validTo, time))
        )
      )
      .limit(1);

    return record ? TicketPriceMapper.toDomain(record) : null;
  }

  async create(ticketPriceEntity: TicketPrice): Promise<TicketPrice> {
    const data = TicketPriceMapper.toPersistence(ticketPriceEntity);
    const [record] = await db.insert(ticketPrice).values(data).returning();
    return TicketPriceMapper.toDomain(record);
  }
}
