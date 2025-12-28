import { Station } from '../../domain/entities';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface IStationRepository {
  findById(id: string): Promise<Station | null>;
  findByName(name: string): Promise<Station | null>;
  findAll(pagination: Pagination): Promise<PaginatedResult<Station>>;
  create(station: Station): Promise<Station>;
  update(station: Station): Promise<Station>;
  delete(id: string): Promise<void>;
}

export const IStationRepositoryToken = Symbol('IStationRepository');
