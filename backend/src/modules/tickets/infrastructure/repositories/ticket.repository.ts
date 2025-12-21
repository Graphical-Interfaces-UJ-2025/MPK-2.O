import { injectable } from 'tsyringe';
import { eq, isNull } from 'drizzle-orm';
import { ITicketRepository } from '../../application/repositories/ticket.repository.interface';
import { Ticket } from '../../domain/entities/ticket.entity';
import { ticket } from '../database/models/ticket.model';
import { ticketPrice } from '../database/models/ticket-price.model';
import { TicketMapper } from '../../domain/mappers/ticket.mapper';
import { db } from '../../../../config/database.config';

@injectable()
export class TicketRepository implements ITicketRepository {
  async findById(id: string): Promise<Ticket | null> {
    const now = new Date();
    const result = await db
      .select({
        ticket: ticket,
        currentPrice: ticketPrice.price,
      })
      .from(ticket)
      .leftJoin(ticketPrice, eq(ticket.id, ticketPrice.ticketId))
      .where(eq(ticket.id, id))
      .limit(1);

    const record = result.find((r) => r.ticket.deletedAt === null);

    if (!record) return null;

    const priceRecord = result.find(
      (r) =>
        r.currentPrice !== null &&
        new Date(r.ticket.createdAt) <= now &&
        r.ticket.deletedAt === null
    );

    return TicketMapper.toDomain(record.ticket, priceRecord?.currentPrice ?? undefined);
  }

  async findByIdIncludeDeleted(id: string): Promise<Ticket | null> {
    const result = await db
      .select({
        ticket: ticket,
        currentPrice: ticketPrice.price,
      })
      .from(ticket)
      .leftJoin(ticketPrice, eq(ticket.id, ticketPrice.ticketId))
      .where(eq(ticket.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return TicketMapper.toDomain(result[0].ticket, result[0].currentPrice ?? undefined);
  }

  async findAll(): Promise<Ticket[]> {
    const result = await db
      .select({
        ticket: ticket,
        currentPrice: ticketPrice.price,
      })
      .from(ticket)
      .leftJoin(ticketPrice, eq(ticket.id, ticketPrice.ticketId))
      .where(isNull(ticket.deletedAt));

    return result.map((r) => TicketMapper.toDomain(r.ticket, r.currentPrice ?? undefined));
  }

  async findAllIncludeDeleted(): Promise<Ticket[]> {
    const result = await db
      .select({
        ticket: ticket,
        currentPrice: ticketPrice.price,
      })
      .from(ticket)
      .leftJoin(ticketPrice, eq(ticket.id, ticketPrice.ticketId));

    return result.map((r) => TicketMapper.toDomain(r.ticket, r.currentPrice ?? undefined));
  }

  async create(ticketEntity: Ticket): Promise<Ticket> {
    const data = TicketMapper.toPersistence(ticketEntity);
    const [record] = await db.insert(ticket).values(data).returning();
    return TicketMapper.toDomain(record);
  }

  async softDelete(id: string): Promise<void> {
    await db.update(ticket).set({ deletedAt: new Date() }).where(eq(ticket.id, id));
  }
}
