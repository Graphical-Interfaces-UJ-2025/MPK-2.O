import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { RequestWithUserInfo } from '../../../shared/infrastructure/middlewares';

export const AuthControllerToken = Symbol('AuthControllerToken');

@autoInjectable()
export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase
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
   *             type: object
   *             required:
   *               - pesel
   *               - password
   *               - firstName
   *               - lastName
   *             properties:
   *               pesel:
   *                 type: string
   *                 description: Polish national identification number (11 digits)
   *               password:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, user, application_manager]
   *                 default: user
   *     responses:
   *       201:
   *         description: User successfully registered
   *       400:
   *         description: Bad request
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { pesel, password, firstName, lastName, role } = req.body;

      const dto = new RegisterUserDto(pesel, password, firstName, lastName, role);
      const user = await this.registerUserUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          pesel: user.pesel,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
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
   *             type: object
   *             required:
   *               - pesel
   *               - password
   *             properties:
   *               pesel:
   *                 type: string
   *                 description: Polish national identification number (11 digits)
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                         pesel:
   *                           type: string
   *                         firstName:
   *                           type: string
   *                         lastName:
   *                           type: string
   *                         role:
   *                           type: string
   *                     token:
   *                       type: string
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { pesel, password } = req.body;

      const dto = new LoginUserDto(pesel, password);
      const { user, token } = await this.loginUserUseCase.execute(dto);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            pesel: user.pesel,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
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
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     pesel:
   *                       type: string
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     role:
   *                       type: string
   *       401:
   *         description: Unauthorized - Invalid or missing token
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
