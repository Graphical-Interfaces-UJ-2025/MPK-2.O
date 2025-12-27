import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';

const router = Router();

const userController: UserController = container.resolve(UserController);

router.get('/balance/recharges', (req, res) => userController.getBalanceRechargesHistory(req, res));

export { router as userRoutes };
