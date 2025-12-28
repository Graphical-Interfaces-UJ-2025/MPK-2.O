import { inject, injectable } from 'tsyringe';
import { ILogger, ILoggerToken } from '../../../shared/application/services/logger.interface';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';
import { Transport } from '../../domain/entities';
import { ITransportRepository, ITransportRepositoryToken } from '../repositories';

@injectable()
export class GetTransportsUseCase {
  private readonly logger: ILogger;

  constructor(
    @inject(ITransportRepositoryToken) private transportRepository: ITransportRepository,
    @inject(ILoggerToken) logger: ILogger
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  async execute(pagination: Pagination): Promise<PaginatedResult<Transport>> {
    this.logger.info('Attempting to get transports', {
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const result = await this.transportRepository.findAll(pagination);

    this.logger.info('Transports retrieved successfully', {
      total: result.total,
      page: result.page,
    });

    return result;
  }
}
