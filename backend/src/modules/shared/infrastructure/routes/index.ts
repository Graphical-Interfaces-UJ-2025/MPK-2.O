import { Router } from 'express';
import { authRoutes } from '../../../auth/infrastructure/routes';
import { ticketRoutes } from '../../../tickets/infrastructure/routes';
import { transactionRoutes } from '../../../transactions/infrastructure/routes';
import { userRoutes } from '../../../user/infrastructure/routes';
import { stationRoutes } from '../../../station/infrastructure/routes';
import { transportRoutes } from '../../../transport/infrastructure/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
router.use('/stations', stationRoutes);
router.use('/transports', transportRoutes);

export { router };
