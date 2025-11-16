import { Router } from 'express';
import { container } from '../../../../container';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = container.resolve(AuthController);

router.post('/register', (req, res) => authController.register(req, res));

export { router as authRoutes };
