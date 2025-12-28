import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { GetUserBalanceRechargesHistoryUseCase } from '../../application/use-cases/get-user-balance-recharges-history.use-case';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';
import { USER_ERRORS } from '../../constants';

@injectable()
export class UserController {
  constructor(
    @inject(GetUserBalanceRechargesHistoryUseCase)
    private getUserBalanceRechargesHistoryUseCase: GetUserBalanceRechargesHistoryUseCase
  ) {}

  /**
   * @swagger
   * /api/users/balance/recharges:
   *   get:
   *     summary: Get balance recharges history for current user
   *     description: Returns paginated balance recharges history for the authenticated user. Only accessible by users with 'user' role.
   *     tags: [Users]
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
   *         description: Balance recharges history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BalanceRechargesHistoryResponse'
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
  async getBalanceRechargesHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const pagination = new Pagination(limit, offset);
      const result = await this.getUserBalanceRechargesHistoryUseCase.execute(userId, pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((recharge) => ({
          transactionId: recharge.transactionId,
          amount: recharge.amount,
          status: recharge.status,
          createdAt: recharge.createdAt,
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
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/users/balance/recharges/{userId}:
   *   get:
   *     summary: Get balance recharges history for a specific user (admin/app_manager only)
   *     description: Returns paginated balance recharges history for a specific user. Only accessible by admin and application_manager roles.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the user to get balance recharges history for
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
   *         description: Balance recharges history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BalanceRechargesHistoryResponse'
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
  async getBalanceRechargesHistoryByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const pagination = new Pagination(limit, offset);
      const result = await this.getUserBalanceRechargesHistoryUseCase.execute(userId, pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((recharge) => ({
          transactionId: recharge.transactionId,
          amount: recharge.amount,
          status: recharge.status,
          createdAt: recharge.createdAt,
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
      const status = message === USER_ERRORS.USER_NOT_FOUND ? 404 : 500;
      res.status(status).json({
        success: false,
        message,
      });
    }
  }
}
