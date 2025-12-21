import { Request, Response } from 'express';
import { autoInjectable, inject } from 'tsyringe';
import { GetAllTicketsUseCase } from '../../application/use-cases/get-all-tickets.use-case';
import { GetTicketByIdUseCase } from '../../application/use-cases/get-ticket-by-id.use-case';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.use-case';
import { DeleteTicketUseCase } from '../../application/use-cases/delete-ticket.use-case';
import { GetOrderHistoryUseCase } from '../../application/use-cases/get-order-history.use-case';
import { CreateTicketDto } from '../../application/dto/create-ticket.dto';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';

@autoInjectable()
export class TicketController {
  constructor(
    @inject(GetAllTicketsUseCase) private getAllTicketsUseCase: GetAllTicketsUseCase,
    @inject(GetTicketByIdUseCase) private getTicketByIdUseCase: GetTicketByIdUseCase,
    @inject(CreateTicketUseCase) private createTicketUseCase: CreateTicketUseCase,
    @inject(DeleteTicketUseCase) private deleteTicketUseCase: DeleteTicketUseCase,
    @inject(GetOrderHistoryUseCase) private getOrderHistoryUseCase: GetOrderHistoryUseCase
  ) {}

  /**
   * @swagger
   * /api/tickets:
   *   get:
   *     summary: Get all tickets
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of tickets
   *       401:
   *         description: Unauthorized
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { role } = (req as RequestWithUser).user;
      const includeDeleted = role === 'admin' || role === 'application_manager';
      const tickets = await this.getAllTicketsUseCase.execute(includeDeleted);

      res.status(200).json({
        success: true,
        data: tickets.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.currentPrice,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          deletedAt: t.deletedAt,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/tickets/{id}:
   *   get:
   *     summary: Get ticket by ID
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Ticket found
   *       404:
   *         description: Ticket not found
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = (req as RequestWithUser).user;
      const includeDeleted = role === 'admin' || role === 'application_manager';
      const ticket = await this.getTicketByIdUseCase.execute(id, includeDeleted);

      if (!ticket) {
        res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: ticket.id,
          name: ticket.name,
          price: ticket.currentPrice,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          deletedAt: ticket.deletedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/tickets:
   *   post:
   *     summary: Create a new ticket
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Ticket created
   *       400:
   *         description: Bad request
   *       403:
   *         description: Forbidden
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price } = req.body;
      const dto = new CreateTicketDto(name, price);
      const ticket = await this.createTicketUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: ticket.id,
          name: ticket.name,
          price: ticket.currentPrice,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/tickets/{id}:
   *   delete:
   *     summary: Delete a ticket (soft delete)
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Ticket deleted
   *       404:
   *         description: Ticket not found
   *       403:
   *         description: Forbidden
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteTicketUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        message,
      });
    }
  }

  /**
   * @swagger
   * /api/tickets/orders-history:
   *   get:
   *     summary: Get order history for current user
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Order history
   *       401:
   *         description: Unauthorized
   */
  async getOrderHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const orders = await this.getOrderHistoryUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: orders.map((o) => ({
          ticketId: o.ticketId,
          ticketName: o.ticketName,
          validFrom: o.validFrom,
          validTo: o.validTo,
          orderedAt: o.orderedAt,
          price: o.price,
          concessionId: o.concessionId,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
