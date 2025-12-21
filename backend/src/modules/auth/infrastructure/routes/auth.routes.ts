import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { container } from 'tsyringe';

const router = Router();

const authController: AuthController = container.resolve(AuthController);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', (req, res) => authController.getMe(req, res));

export { router as authRoutes };
