import { Router } from 'express';
import { container } from 'tsyringe';
import { RouteFinderController } from '../controllers';

const router = Router();

const routeFinderController: RouteFinderController = container.resolve(RouteFinderController);

router.post('/find', (req, res) => routeFinderController.findRoute(req, res));

export { router as routeFinderRoutes };
