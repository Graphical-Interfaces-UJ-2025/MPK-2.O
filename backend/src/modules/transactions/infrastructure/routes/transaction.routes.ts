import { Router } from 'express';
import { container } from 'tsyringe';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

const transactionController: TransactionController = container.resolve(TransactionController);

router.post('/recharge', (req, res) => transactionController.initiateRecharge(req, res));

export { router as transactionRoutes };
