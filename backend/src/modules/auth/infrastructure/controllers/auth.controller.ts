import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { RequestWithUserInfo } from '../../../shared/infrastructure/middlewares';

@injectable()
export class AuthController {
  constructor(
    @inject(RegisterUserUseCase) private registerUserUseCase: RegisterUserUseCase,
    @inject(LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    @inject(GetCurrentUserUseCase) private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { pesel, email, password, firstName, lastName } = req.body;

      const dto = new RegisterUserDto(pesel, email, password, firstName, lastName);
      const { token } = await this.registerUserUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: User successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const dto = new LoginUserDto(email, password);
      const { token } = await this.loginUserUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user info
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user info
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const { user: authUser } = req as RequestWithUserInfo;
      const user = await this.getCurrentUserUseCase.execute(authUser.id);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          pesel: user.pesel,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          balance: user.balance,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
