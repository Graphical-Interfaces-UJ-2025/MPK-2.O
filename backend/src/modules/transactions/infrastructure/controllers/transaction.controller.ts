import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { InitiateBalanceRechargeUseCase } from '../../application/use-cases/initiate-balance-recharge.use-case';
import { GetUserTransactionsUseCase } from '../../application/use-cases/get-user-transactions.use-case';
import { RequestWithUser } from '../../../shared/infrastructure/middlewares';

@injectable()
export class TransactionController {
  constructor(
    @inject(InitiateBalanceRechargeUseCase)
    private initiateBalanceRechargeUseCase: InitiateBalanceRechargeUseCase,
    @inject(GetUserTransactionsUseCase)
    private getUserTransactionsUseCase: GetUserTransactionsUseCase
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

  /**
   * @swagger
   * /api/transactions/history:
   *   get:
   *     summary: Get transaction history for current user
   *     description: Returns all transactions for the authenticated user including recharges, ticket purchases, and refunds.
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Transaction history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TransactionHistoryResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = (req as RequestWithUser).user;

      const transactions = await this.getUserTransactionsUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          ticketId: t.ticketId,
          status: t.status,
          createdAt: t.createdAt,
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
