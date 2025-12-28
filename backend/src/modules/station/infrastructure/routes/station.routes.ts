import { Router } from 'express';
import { container } from 'tsyringe';
import { StationController } from '../controllers';

const router = Router();

const stationController: StationController = container.resolve(StationController);

router.post('/', (req, res) => stationController.create(req, res));
router.get('/', (req, res) => stationController.getAll(req, res));
router.get('/:id', (req, res) => stationController.getById(req, res));
router.put('/:id', (req, res) => stationController.update(req, res));
router.delete('/:id', (req, res) => stationController.delete(req, res));

export { router as stationRoutes };
