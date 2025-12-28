import { Transport } from '../../domain/entities';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface ITransportRepository {
  findById(id: string): Promise<Transport | null>;
  findByReferenceNumber(referenceNumber: string): Promise<Transport | null>;
  findAll(pagination: Pagination): Promise<PaginatedResult<Transport>>;
  create(transport: Transport): Promise<Transport>;
  update(transport: Transport): Promise<Transport>;
  delete(id: string): Promise<void>;
}

export const ITransportRepositoryToken = Symbol('ITransportRepository');
