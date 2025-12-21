import { Router } from 'express';
import { authRoutes } from '../../../auth/infrastructure/routes';
import { ticketRoutes } from '../../../tickets/infrastructure/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);

export { router };
