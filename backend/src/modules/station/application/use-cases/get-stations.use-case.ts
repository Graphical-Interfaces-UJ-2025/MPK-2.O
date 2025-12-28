import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { Station } from '../../domain/entities';
import { IStationRepository, IStationRepositoryToken } from '../repositories';

@injectable()
export class GetStationsUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(IStationRepositoryToken) private stationRepository: IStationRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(pagination: Pagination): Promise<PaginatedResult<Station>> {
    this.logger.info('Attempting to get stations', {
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const result = await this.stationRepository.findAll(pagination);

    this.logger.info('Stations retrieved successfully', {
      total: result.total,
      page: result.page,
    });

    return result;
  }
}
