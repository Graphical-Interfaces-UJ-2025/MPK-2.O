import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import {
  CreateStationUseCase,
  GetStationUseCase,
  GetStationsUseCase,
  UpdateStationUseCase,
  DeleteStationUseCase,
} from '../../application/use-cases';
import { CreateStationDto, UpdateStationDto } from '../../application/dto';
import { Pagination } from '../../../shared/application/query/pagination.query';

@injectable()
export class StationController {
  constructor(
    @inject(CreateStationUseCase) private createStationUseCase: CreateStationUseCase,
    @inject(GetStationUseCase) private getStationUseCase: GetStationUseCase,
    @inject(GetStationsUseCase) private getStationsUseCase: GetStationsUseCase,
    @inject(UpdateStationUseCase) private updateStationUseCase: UpdateStationUseCase,
    @inject(DeleteStationUseCase) private deleteStationUseCase: DeleteStationUseCase
  ) {}

  /**
   * @swagger
   * /api/stations:
   *   post:
   *     summary: Create a new station
   *     tags: [Stations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - longitude
   *               - latitude
   *             properties:
   *               name:
   *                 type: string
   *               longitude:
   *                 type: number
   *               latitude:
   *                 type: number
   *     responses:
   *       201:
   *         description: Station created successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, longitude, latitude } = req.body;
      const dto = new CreateStationDto(name, longitude, latitude);
      const station = await this.createStationUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: station.id,
          name: station.name,
          location: {
            longitude: station.location.longitude,
            latitude: station.location.latitude,
          },
          createdAt: station.createdAt,
          updatedAt: station.updatedAt,
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
   * /api/stations/{id}:
   *   get:
   *     summary: Get a station by ID
   *     tags: [Stations]
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
   *         description: Station retrieved successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Station not found
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const station = await this.getStationUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: {
          id: station.id,
          name: station.name,
          location: {
            longitude: station.location.longitude,
            latitude: station.location.latitude,
          },
          createdAt: station.createdAt,
          updatedAt: station.updatedAt,
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
   * /api/stations:
   *   get:
   *     summary: Get all stations with pagination
   *     tags: [Stations]
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
   *         description: Stations retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const pagination = new Pagination(limit, offset);
      const result = await this.getStationsUseCase.execute(pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((station) => ({
          id: station.id,
          name: station.name,
          location: {
            longitude: station.location.longitude,
            latitude: station.location.latitude,
          },
          createdAt: station.createdAt,
          updatedAt: station.updatedAt,
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
   * /api/stations/{id}:
   *   put:
   *     summary: Update a station
   *     tags: [Stations]
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
   *               - name
   *               - longitude
   *               - latitude
   *             properties:
   *               name:
   *                 type: string
   *               longitude:
   *                 type: number
   *               latitude:
   *                 type: number
   *     responses:
   *       200:
   *         description: Station updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Station not found
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, longitude, latitude } = req.body;
      const dto = new UpdateStationDto(name, longitude, latitude);
      const station = await this.updateStationUseCase.execute(id, dto);

      res.status(200).json({
        success: true,
        data: {
          id: station.id,
          name: station.name,
          location: {
            longitude: station.location.longitude,
            latitude: station.location.latitude,
          },
          createdAt: station.createdAt,
          updatedAt: station.updatedAt,
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
   * /api/stations/{id}:
   *   delete:
   *     summary: Soft delete a station
   *     tags: [Stations]
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
   *         description: Station deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Station not found
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteStationUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Station deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
