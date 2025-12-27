import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { InitiateBalanceRechargeUseCase } from '../../application/use-cases/initiate-balance-recharge.use-case';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';

@injectable()
export class TransactionController {
  constructor(
    @inject(InitiateBalanceRechargeUseCase)
    private initiateBalanceRechargeUseCase: InitiateBalanceRechargeUseCase
  ) {}

  /**
   * @swagger
   * /api/transactions/recharge:
   *   post:
   *     summary: Initiate a balance recharge transaction
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *             properties:
   *               amount:
   *                 type: integer
   *                 description: Amount to recharge in grosze (minimum 5000 = 50 PLN)
   *     responses:
   *       201:
   *         description: Recharge transaction initiated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     transactionId:
   *                       type: string
   *                     amount:
   *                       type: integer
   *                     status:
   *                       type: string
   *       400:
   *         description: Bad request - Invalid amount or user not found
   *       401:
   *         description: Unauthorized
   */
  async initiateRecharge(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const { amount } = req.body;

      const transaction = await this.initiateBalanceRechargeUseCase.execute(userId, amount);

      res.status(201).json({
        success: true,
        data: {
          transactionId: transaction.id,
          amount: transaction.amount,
          status: transaction.status,
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
