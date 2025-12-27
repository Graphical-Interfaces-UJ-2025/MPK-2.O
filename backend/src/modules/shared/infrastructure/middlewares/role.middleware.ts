import { Request, Response, NextFunction } from 'express';
import { container } from '../../../../container';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../user/application/repositories/user.repository.interface';
import { UserRole } from '../../../user/domain/entities/user.entity';
import { RequestWithUserInfo } from './auth.middleware';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestWithUser = Request & {
  user: { id: string; role: UserRole };
};

export interface RoleProtectedRouteConfig {
  path: string;
  methods: (HttpMethod | '*')[];
  roles: UserRole[];
}

function matchesPath(routePath: string, requestPath: string): boolean {
  if (routePath.endsWith('/*')) {
    const prefix = routePath.slice(0, -1);
    return requestPath.startsWith(prefix);
  }
  return requestPath === routePath || requestPath.startsWith(routePath + '/');
}

function matchesMethod(methods: (HttpMethod | '*')[], requestMethod: string): boolean {
  return methods.includes('*') || methods.includes(requestMethod as HttpMethod);
}

export function createRoleMiddleware(protectedRoutes: RoleProtectedRouteConfig[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const routeConfig = protectedRoutes.find(
      (route) => matchesPath(route.path, req.path) && matchesMethod(route.methods, req.method)
    );

    if (!routeConfig) {
      next();
      return;
    }

    const userInfo = (req as RequestWithUserInfo).user;
    if (!userInfo) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userRepository = container.resolve<IUserRepository>(IUserRepositoryToken);
    const user = await userRepository.findById(userInfo.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    if (!routeConfig.roles.includes(user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden - Insufficient permissions' });
      return;
    }

    (req as RequestWithUser).user = { id: user.id, role: user.role };
    next();
  };
}
