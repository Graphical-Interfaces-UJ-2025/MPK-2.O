import './container'; // Initialize DI container
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { router } from './modules/shared/infrastructure/routes';
import {
  createAuthMiddleware,
  ProtectedRouteConfig,
  createRoleMiddleware,
  RoleProtectedRouteConfig,
} from './modules/shared/infrastructure/middlewares';
import { writeFileSync } from 'fs';

const protectedRoutes: ProtectedRouteConfig[] = [
  { path: '/api/auth/me', methods: ['GET'] },
  { path: '/api/tickets', methods: ['*'] },
];

const roleProtectedRoutes: RoleProtectedRouteConfig[] = [
  { path: '/api/tickets/orders-history', methods: ['GET'], roles: ['user'] },
  { path: '/api/tickets', methods: ['POST'], roles: ['admin', 'application_manager'] },
  { path: '/api/tickets/', methods: ['DELETE'], roles: ['admin', 'application_manager'] },
];

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createAuthMiddleware(protectedRoutes));
app.use(createRoleMiddleware(roleProtectedRoutes));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', router);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

async function initSwaggerDoc() {
  if (process.argv.includes('--api-client-and-exit')) {
    writeFileSync('./api.json', JSON.stringify(swaggerSpec));
    process.exit(0);
  }
}

initSwaggerDoc();

export { app };
