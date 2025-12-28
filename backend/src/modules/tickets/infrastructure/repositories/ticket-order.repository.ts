import { injectable } from 'tsyringe';
import { eq, count, desc } from 'drizzle-orm';
import { ITicketOrderRepository } from '../../application/repositories/ticket-order.repository.interface';
import { TicketOrder } from '../../domain/entities/ticket-order.entity';
import { ticketOrder } from '../database/models/ticket-order.model';
import { ticket } from '../database/models/ticket.model';
import { TicketOrderMapper } from '../../domain/mappers/ticket-order.mapper';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
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

  async findByUserIdPaginated(
    userId: string,
    pagination: Pagination
  ): Promise<PaginatedResult<TicketOrder>> {
    const whereCondition = eq(ticketOrder.userId, userId);

    const [totalResult] = await db
      .select({ count: count() })
      .from(ticketOrder)
      .where(whereCondition);

    const result = await db
      .select({
        order: ticketOrder,
        ticketName: ticket.name,
      })
      .from(ticketOrder)
      .leftJoin(ticket, eq(ticketOrder.ticketId, ticket.id))
      .where(whereCondition)
      .orderBy(desc(ticketOrder.orderedAt))
      .limit(pagination.limit)
      .offset(pagination.offset);

    const data = result.map((r) => TicketOrderMapper.toDomain(r.order, r.ticketName ?? undefined));

    return new PaginatedResult(data, pagination.limit, pagination.offset, totalResult.count);
  }

  async create(order: TicketOrder): Promise<TicketOrder> {
    const record = TicketOrderMapper.toPersistence(order);
    const [created] = await db.insert(ticketOrder).values(record).returning();
    return TicketOrderMapper.toDomain(created, order.ticketName);
  }
}
