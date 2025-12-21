import { Router } from 'express';
import { container } from '../../../../container';
import { TicketController } from '../controllers/ticket.controller';

const router = Router();
const ticketController = container.resolve<TicketController>(TicketController);

router.get('/', (req, res) => ticketController.getAll(req, res));
router.get('/orders-history', (req, res) => ticketController.getOrderHistory(req, res));
router.get('/:id', (req, res) => ticketController.getById(req, res));
router.post('/', (req, res) => ticketController.create(req, res));
router.delete('/:id', (req, res) => ticketController.delete(req, res));

export { router as ticketRoutes };
