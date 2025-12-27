import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { GetUserBalanceRechargesHistoryUseCase } from '../../application/use-cases/get-user-balance-recharges-history.use-case';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';

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
   *     summary: Get user balance recharges history
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
   *         description: User balance recharges history
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       transactionId:
   *                         type: string
   *                       amount:
   *                         type: integer
   *                       status:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     pageSize:
   *                       type: integer
   *                     hasNext:
   *                       type: boolean
   *                     hasPrev:
   *                       type: boolean
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
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
}
