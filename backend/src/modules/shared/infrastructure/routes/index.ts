import { Router } from 'express';
import { authRoutes } from '../../../auth/infrastructure/routes';

const router = Router();

router.use('/auth', authRoutes);

export { router };
