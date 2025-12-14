import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthService, HashResult } from '../../application/services/auth.service.interface';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';

@injectable()
export class AuthService implements IAuthService {
  private readonly saltRounds = 10;
  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  private readonly logger: ILogger;

  constructor(@inject(ILoggerToken) logger: ILogger) {
    this.logger = logger.child('AuthService');
  }

  async hashPassword(password: string): Promise<HashResult> {
    this.logger.debug('Hashing password');
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    this.logger.debug('Comparing password with hash');
    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      this.logger.debug('Password comparison successful');
    } else {
      this.logger.warn('Password comparison failed');
    }
    return isMatch;
  }

  generateToken(userId: string): string {
    this.logger.info(`Generating JWT token for user`, { userId });
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: 604_800, // 7 days
    });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      this.logger.info(`Token verified successfully for user`, { userId: decoded.userId });
      return decoded;
    } catch (error) {
      this.logger.warn('Token verification failed', error instanceof Error ? error : undefined);
      return null;
    }
  }
}
