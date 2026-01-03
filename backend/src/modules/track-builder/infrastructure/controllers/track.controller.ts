import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import {
  CreateTrackUseCase,
  GetTrackUseCase,
  GetTracksUseCase,
  UpdateTrackUseCase,
  DeleteTrackUseCase,
} from '../../application/use-cases';
import { CreateTrackDto, UpdateTrackDto } from '../../application/dto';
import { Pagination } from '../../../shared/application/query/pagination.query';

@injectable()
export class TrackController {
  constructor(
    @inject(CreateTrackUseCase) private createTrackUseCase: CreateTrackUseCase,
    @inject(GetTrackUseCase) private getTrackUseCase: GetTrackUseCase,
    @inject(GetTracksUseCase) private getTracksUseCase: GetTracksUseCase,
    @inject(UpdateTrackUseCase) private updateTrackUseCase: UpdateTrackUseCase,
    @inject(DeleteTrackUseCase) private deleteTrackUseCase: DeleteTrackUseCase
  ) {}

  /**
   * @swagger
   * /api/tracks:
   *   post:
   *     summary: Create a new track
   *     tags: [Tracks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - transportRefNumber
   *               - stationIds
   *             properties:
   *               transportRefNumber:
   *                 type: string
   *                 description: Reference number of the transport
   *               stationIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of station UUIDs defining the track
   *     responses:
   *       201:
   *         description: Track created successfully
   *       400:
   *         description: Bad request - validation failed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { transportRefNumber, stationIds } = req.body;
      const dto = new CreateTrackDto(transportRefNumber, stationIds);
      const track = await this.createTrackUseCase.execute(dto);

      res.status(201).json({
        success: true,
        data: {
          id: track.id,
          name: track.name,
          transportRefNumber: track.transportRefNumber,
          stationIds: track.stationIds,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
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
   * /api/tracks/{id}:
   *   get:
   *     summary: Get a track by ID
   *     tags: [Tracks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Track ID (integer)
   *     responses:
   *       200:
   *         description: Track retrieved successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Track not found
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid track ID - must be an integer',
        });
        return;
      }

      const track = await this.getTrackUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: {
          id: track.id,
          name: track.name,
          transportRefNumber: track.transportRefNumber,
          stationIds: track.stationIds,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
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
   * /api/tracks:
   *   get:
   *     summary: Get all tracks with pagination
   *     tags: [Tracks]
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
   *         description: Tracks retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const pagination = new Pagination(limit, offset);
      const result = await this.getTracksUseCase.execute(pagination);

      res.status(200).json({
        success: true,
        data: result.data.map((track) => ({
          id: track.id,
          name: track.name,
          transportRefNumber: track.transportRefNumber,
          stationIds: track.stationIds,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
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
   * /api/tracks/{id}:
   *   put:
   *     summary: Update a track
   *     tags: [Tracks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - transportRefNumber
   *               - stationIds
   *             properties:
   *               transportRefNumber:
   *                 type: string
   *               stationIds:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Track updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Track not found
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid track ID - must be an integer',
        });
        return;
      }

      const { transportRefNumber, stationIds } = req.body;
      const dto = new UpdateTrackDto(transportRefNumber, stationIds);
      const track = await this.updateTrackUseCase.execute(id, dto);

      res.status(200).json({
        success: true,
        data: {
          id: track.id,
          name: track.name,
          transportRefNumber: track.transportRefNumber,
          stationIds: track.stationIds,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
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
   * /api/tracks/{id}:
   *   delete:
   *     summary: Soft delete a track
   *     tags: [Tracks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Track deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Admin only
   *       404:
   *         description: Track not found
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid track ID - must be an integer',
        });
        return;
      }

      await this.deleteTrackUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Track deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
