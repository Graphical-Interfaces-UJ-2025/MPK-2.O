import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import {
  CreateTransportUseCase,
  GetTransportUseCase,
  GetTransportsUseCase,
  UpdateTransportUseCase,
  DeleteTransportUseCase,
} from '../../application/use-cases';
import { CreateTransportDto, UpdateTransportDto } from '../../application/dto';
import { Pagination } from '../../../shared/application/query/pagination.query';

@injectable()
export class TransportController {
  constructor(
    @inject(CreateTransportUseCase) private createTransportUseCase: CreateTransportUseCase,
    @inject(GetTransportUseCase) private getTransportUseCase: GetTransportUseCase,
    @inject(GetTransportsUseCase) private getTransportsUseCase: GetTransportsUseCase,
    @inject(UpdateTransportUseCase) private updateTransportUseCase: UpdateTransportUseCase,
    @inject(DeleteTransportUseCase) private deleteTransportUseCase: DeleteTransportUseCase
  ) {}

  /**
   * @swagger
   * /api/transports:
   *   post:
   *     summary: Create a new transport
   *     tags: [Transports]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - referenceNumber
   *               - type
   *               - directionName
   *             properties:
   *               referenceNumber:
   *                 type: string
   *               type:
   *                 type: string
   *                 enum: [autobus, tram]
   *               directionName:
   *                 type: string
   *     responses:
   *       201:
   *         description: Transport created successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { referenceNumber, type, directionName } = req.body;
      const dto = new CreateTransportDto(referenceNumber, type, directionName);
      const transport = await this.createTransportUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: transport.id,
          referenceNumber: transport.referenceNumber,
          type: transport.type,
          directionName: transport.directionName,
          createdAt: transport.createdAt,
          updatedAt: transport.updatedAt,
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
   * /api/transports/{id}:
   *   get:
   *     summary: Get a transport by ID
   *     tags: [Transports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Transport retrieved successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Transport not found
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const transport = await this.getTransportUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: {
          id: transport.id,
          referenceNumber: transport.referenceNumber,
          type: transport.type,
          directionName: transport.directionName,
          createdAt: transport.createdAt,
          updatedAt: transport.updatedAt,
        },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /api/transports:
   *   get:
   *     summary: Get all transports with pagination
   *     tags: [Transports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Transports retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const pagination = new Pagination(limit, offset);
      const result = await this.getTransportsUseCase.execute(pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((transport) => ({
          id: transport.id,
          referenceNumber: transport.referenceNumber,
          type: transport.type,
          directionName: transport.directionName,
          createdAt: transport.createdAt,
          updatedAt: transport.updatedAt,
        })),
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev,
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
   * /api/transports/{id}:
   *   put:
   *     summary: Update a transport
   *     tags: [Transports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - referenceNumber
   *               - type
   *               - directionName
   *             properties:
   *               referenceNumber:
   *                 type: string
   *               type:
   *                 type: string
   *                 enum: [autobus, tram]
   *               directionName:
   *                 type: string
   *     responses:
   *       200:
   *         description: Transport updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Transport not found
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { referenceNumber, type, directionName } = req.body;
      const dto = new UpdateTransportDto(referenceNumber, type, directionName);
      const transport = await this.updateTransportUseCase.execute(id, dto);

      res.status(200).json({
        success: true,
        data: {
          id: transport.id,
          referenceNumber: transport.referenceNumber,
          type: transport.type,
          directionName: transport.directionName,
          createdAt: transport.createdAt,
          updatedAt: transport.updatedAt,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const status = message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        message,
      });
    }
  }

  /**
   * @swagger
   * /api/transports/{id}:
   *   delete:
   *     summary: Soft delete a transport
   *     tags: [Transports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Transport deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Transport not found
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteTransportUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Transport deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
