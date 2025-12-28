import { Router } from 'express';
import { container } from 'tsyringe';
import { TransportController } from '../controllers';

const router = Router();

const transportController: TransportController = container.resolve(TransportController);

router.post('/', (req, res) => transportController.create(req, res));
router.get('/', (req, res) => transportController.getAll(req, res));
router.get('/:id', (req, res) => transportController.getById(req, res));
router.put('/:id', (req, res) => transportController.update(req, res));
router.delete('/:id', (req, res) => transportController.delete(req, res));

export { router as transportRoutes };
