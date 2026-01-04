import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { FindRouteUseCase } from '../../application/use-cases';
import { FindRouteDto, RouteResponseMapper } from '../../application/dto';

@injectable()
export class RouteFinderController {
  constructor(@inject(FindRouteUseCase) private findRouteUseCase: FindRouteUseCase) {}

  /**
   * @swagger
   * /api/routes/find:
   *   post:
   *     summary: Find routes between two locations
   *     tags: [Routes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - start
   *               - destination
   *             properties:
   *               start:
   *                 type: object
   *                 properties:
   *                   stationId:
   *                     type: string
   *                   point:
   *                     type: object
   *                     properties:
   *                       longitude:
   *                         type: number
   *                       latitude:
   *                         type: number
   *               destination:
   *                 type: object
   *                 properties:
   *                   stationId:
   *                     type: string
   *                   point:
   *                     type: object
   *                     properties:
   *                       longitude:
   *                         type: number
   *                       latitude:
   *                         type: number
   *     responses:
   *       200:
   *         description: Routes found successfully
   *       400:
   *         description: Bad request
   */
  async findRoute(req: Request, res: Response): Promise<void> {
    try {
      const dto = FindRouteDto.fromRequest(req.body);
      const routes = await this.findRouteUseCase.execute(dto);
      const response = RouteResponseMapper.toResponse(routes);

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
