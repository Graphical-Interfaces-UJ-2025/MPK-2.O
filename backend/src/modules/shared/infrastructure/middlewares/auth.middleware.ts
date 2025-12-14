import { Request, Response, NextFunction } from 'express';
import { container } from '../../../../container';
import {
  IAuthService,
  IAuthServiceToken,
} from '../../../auth/application/services/auth.service.interface';

export type RequestWithUserInfo = Request & {
  user: { id: string };
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ProtectedRouteConfig {
  path: string;
  methods: (HttpMethod | '*')[];
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

export function createAuthMiddleware(protectedRoutes: ProtectedRouteConfig[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const isProtected = protectedRoutes.some(
      (route) => matchesPath(route.path, req.path) && matchesMethod(route.methods, req.method)
    );

    if (!isProtected) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
      return;
    }

    const token = authHeader.substring(7);
    const authService = container.resolve<IAuthService>(IAuthServiceToken);
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    (req as RequestWithUserInfo).user = { id: decoded.userId };
    next();
  };
}
