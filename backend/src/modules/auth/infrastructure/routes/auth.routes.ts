import { Router } from 'express';
import { container } from '../../../../container';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = container.resolve<AuthController>(AuthController);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', (req, res) => authController.getMe(req, res));

export { router as authRoutes };
