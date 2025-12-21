import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { ITicketOrderRepository } from '../../application/repositories/ticket-order.repository.interface';
import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { ticketOrder } from '../database/models/ticket-order.model';
import { ticket } from '../database/models/ticket.model';
import { TicketOrderMapper } from '../../domain/mappers/ticket-order.mapper';
import { db } from '../../../../config/database.config';

@injectable()
export class TicketOrderRepository implements ITicketOrderRepository {
  async findByUserId(userId: string): Promise<TicketOrder[]> {
    const result = await db
      .select({
        order: ticketOrder,
        ticketName: ticket.name,
      })
      .from(ticketOrder)
      .leftJoin(ticket, eq(ticketOrder.ticketId, ticket.id))
      .where(eq(ticketOrder.userId, userId));

    return result.map((r) => TicketOrderMapper.toDomain(r.order, r.ticketName ?? undefined));
  }
}
