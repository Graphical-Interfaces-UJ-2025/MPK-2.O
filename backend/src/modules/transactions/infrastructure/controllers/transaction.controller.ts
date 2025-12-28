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
   *             $ref: '#/components/schemas/RechargeRequest'
   *     responses:
   *       201:
   *         description: Recharge transaction initiated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RechargeInitiatedResponse'
   *       400:
   *         description: Bad request - Invalid amount or user not found
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
   */
  async initiateRecharge(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;
      const { amount } = req.body;

      await this.initiateBalanceRechargeUseCase.execute(userId, amount);

      res.status(201).json({
        success: true,
        message: 'Balance recharge initiated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
