import { Router } from 'express';
import { container } from 'tsyringe';
import { TrackController } from '../controllers';

const router = Router();

const trackController: TrackController = container.resolve(TrackController);

router.post('/', (req, res) => trackController.create(req, res));
router.get('/', (req, res) => trackController.getAll(req, res));
router.get('/:id', (req, res) => trackController.getById(req, res));
router.put('/:id', (req, res) => trackController.update(req, res));
router.delete('/:id', (req, res) => trackController.delete(req, res));

export { router as trackRoutes };
