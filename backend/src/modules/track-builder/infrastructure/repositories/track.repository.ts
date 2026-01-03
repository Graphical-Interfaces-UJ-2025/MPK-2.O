import { injectable } from 'tsyringe';
import { Track } from '../../domain/entities';
import { TrackMapper, TrackRecord } from '../../domain/mappers';
import { ITrackRepository } from '../../application/repositories';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

const predefinedTracks: TrackRecord[] = [
  {
    id: 1,
    name: 'Airport Terminal',
    transportRefNumber: '252',
    stationIds: ['station-1', 'station-2', 'station-5'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 2,
    name: 'University Campus',
    transportRefNumber: '1',
    stationIds: ['station-4', 'station-2', 'station-3'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
];

@injectable()
export class TrackRepository implements ITrackRepository {
  private tracks: Map<number, TrackRecord> = new Map(predefinedTracks.map((t) => [t.id, t]));
  private nextId: number = predefinedTracks.length + 1;

  async findById(id: number): Promise<Track | null> {
    const record = this.tracks.get(id);
    if (!record || record.deletedAt !== null) {
      return null;
    }
    return TrackMapper.toDomain(record);
  }

  async findAll(pagination: Pagination): Promise<PaginatedResult<Track>> {
    const allRecords = Array.from(this.tracks.values()).filter((r) => r.deletedAt === null);

    const total = allRecords.length;
    const paginatedRecords = allRecords.slice(
      pagination.offset,
      pagination.offset + pagination.limit
    );

    return new PaginatedResult(paginatedRecords.map(TrackMapper.toDomain), pagination, total);
  }

  async create(track: Track): Promise<Track> {
    const record = TrackMapper.toPersistence(track);
    this.tracks.set(record.id, record);
    return TrackMapper.toDomain(record);
  }

  async update(track: Track): Promise<Track> {
    const record = TrackMapper.toPersistence(track);
    this.tracks.set(record.id, record);
    return TrackMapper.toDomain(record);
  }

  async delete(id: number): Promise<void> {
    this.tracks.delete(id);
  }

  async getNextId(): Promise<number> {
    const id = this.nextId;
    this.nextId++;
    return id;
  }
}
