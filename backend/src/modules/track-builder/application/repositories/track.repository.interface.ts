import { Track } from '../../domain/entities';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

export interface ITrackRepository {
  findById(id: number): Promise<Track | null>;
  findAll(pagination: Pagination): Promise<PaginatedResult<Track>>;
  create(track: Track): Promise<Track>;
  update(track: Track): Promise<Track>;
  delete(id: number): Promise<void>;
  getNextId(): Promise<number>;
}

export const ITrackRepositoryToken = Symbol('ITrackRepository');
