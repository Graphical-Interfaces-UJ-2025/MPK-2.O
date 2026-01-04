import { Request, Response } from 'express';
import { autoInjectable, inject } from 'tsyringe';
import { GetAllTicketsUseCase } from '../../application/use-cases/get-all-tickets.use-case';
import { GetTicketByIdUseCase } from '../../application/use-cases/get-ticket-by-id.use-case';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.use-case';
import { DeleteTicketUseCase } from '../../application/use-cases/delete-ticket.use-case';
import { GetUserTicketOrdersHistoryUseCase } from '../../application/use-cases/get-user-ticket-orders-history.use-case';
import { PurchaseTicketUseCase } from '../../application/use-cases/purchase-ticket.use-case';
import { CreateTicketDto } from '../../application/dto/create-ticket.dto';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { TICKET_ERRORS } from '../../constants';

@autoInjectable()
export class TicketController {
  constructor(
    @inject(GetAllTicketsUseCase) private getAllTicketsUseCase: GetAllTicketsUseCase,
    @inject(GetTicketByIdUseCase) private getTicketByIdUseCase: GetTicketByIdUseCase,
    @inject(CreateTicketUseCase) private createTicketUseCase: CreateTicketUseCase,
    @inject(DeleteTicketUseCase) private deleteTicketUseCase: DeleteTicketUseCase,
    @inject(GetUserTicketOrdersHistoryUseCase)
    private getUserTicketOrdersHistoryUseCase: GetUserTicketOrdersHistoryUseCase,
    @inject(PurchaseTicketUseCase) private purchaseTicketUseCase: PurchaseTicketUseCase
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
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TicketListResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
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
          validTime: t.validTime,
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
   *           format: uuid
   *     responses:
   *       200:
   *         description: Ticket found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TicketResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Ticket not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
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
          validTime: ticket.validTime,
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
   *             $ref: '#/components/schemas/CreateTicketRequest'
   *     responses:
   *       201:
   *         description: Ticket created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TicketResponse'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, validTime } = req.body;
      const dto = new CreateTicketDto(name, price, validTime);
      const ticket = await this.createTicketUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: ticket.id,
          name: ticket.name,
          price: ticket.currentPrice,
          validTime: ticket.validTime,
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
   *           format: uuid
   *     responses:
   *       200:
   *         description: Ticket deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessMessageResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Ticket not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
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
   * /api/tickets/orders-history/{id}:
   *   get:
   *     summary: Get order history for current user
   *     description: Returns paginated ticket order history for the authenticated user. Only accessible by users with 'user' role.
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of items to skip
   *     responses:
   *       200:
   *         description: Ticket orders history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TicketOrdersHistoryResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - User role required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async getOrderHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const pagination = new Pagination(limit, offset);
      const result = await this.getUserTicketOrdersHistoryUseCase.execute(userId, pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((o) => ({
          ticketId: o.ticketId,
          ticketName: o.ticketName,
          validFrom: o.validFrom,
          validTo: o.validTo,
          orderedAt: o.orderedAt,
          price: o.price,
          concessionId: o.concessionId,
        })),
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev,
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
   * /api/tickets/orders-history/{userId}:
   *   get:
   *     summary: Get order history for a specific user (admin/app_manager only)
   *     description: Returns paginated ticket order history for a specific user. Only accessible by admin and application_manager roles.
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the user to get order history for
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of items to skip
   *     responses:
   *       200:
   *         description: Ticket orders history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TicketOrdersHistoryResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       403:
   *         description: Forbidden - Admin or Application Manager role required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async getOrderHistoryByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const pagination = new Pagination(limit, offset);
      const result = await this.getUserTicketOrdersHistoryUseCase.execute(userId, pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((o) => ({
          ticketId: o.ticketId,
          ticketName: o.ticketName,
          validFrom: o.validFrom,
          validTo: o.validTo,
          orderedAt: o.orderedAt,
          price: o.price,
          concessionId: o.concessionId,
        })),
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message === TICKET_ERRORS.USER_NOT_FOUND ? 404 : 500;
      res.status(status).json({
        success: false,
        message,
      });
    }
  }

  /**
   * @swagger
   * /api/tickets/purchase:
   *   post:
   *     summary: Purchase a ticket
   *     tags: [Tickets]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PurchaseTicketRequest'
   *     responses:
   *       201:
   *         description: Ticket purchased successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PurchaseTicketResponse'
   *       400:
   *         description: Bad request (insufficient balance, invalid data)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Ticket not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async purchase(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const { ticketId, validFrom, validTo, concessionId } = req.body;

      const order = await this.purchaseTicketUseCase.execute({
        userId,
        ticketId,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        concessionId,
      });

      res.status(201).json({
        success: true,
        data: {
          ticketId: order.ticketId,
          ticketName: order.ticketName,
          validFrom: order.validFrom,
          validTo: order.validTo,
          orderedAt: order.orderedAt,
          price: order.price,
          concessionId: order.concessionId,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      let status = 400;

      if (message === TICKET_ERRORS.USER_NOT_FOUND) {
        status = 401;
      } else if (message === TICKET_ERRORS.TICKET_NOT_FOUND) {
        status = 404;
      }

      res.status(status).json({
        success: false,
        message,
      });
    }
  }
}
