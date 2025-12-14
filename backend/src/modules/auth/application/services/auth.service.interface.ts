export interface HashResult {
  hash: string;
  salt: string;
}

export interface IAuthService {
  hashPassword(password: string): Promise<HashResult>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(userId: string): string;
  verifyToken(token: string): { userId: string } | null;
}

export const IAuthServiceToken = Symbol('IAuthService');
