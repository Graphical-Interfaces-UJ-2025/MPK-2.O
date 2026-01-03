import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { Track } from '../../domain/entities';
import { ITrackRepository, ITrackRepositoryToken } from '../repositories';

@injectable()
export class GetTracksUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITrackRepositoryToken) private trackRepository: ITrackRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(pagination: Pagination): Promise<PaginatedResult<Track>> {
    this.logger.info('Attempting to get tracks', {
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const result = await this.trackRepository.findAll(pagination);

    this.logger.info('Tracks retrieved successfully', {
      total: result.total,
      page: result.page,
    });

    return result;
  }
}
