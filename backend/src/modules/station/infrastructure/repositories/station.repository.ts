import { injectable } from 'tsyringe';
import { Station } from '../../domain/entities';
import { StationMapper, StationRecord } from '../../domain/mappers';
import { IStationRepository } from '../../application/repositories';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

const predefinedStations: StationRecord[] = [
  {
    id: 'station-1',
    name: 'Central Station',
    longitude: 19.9449799,
    latitude: 50.0646501,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'station-2',
    name: 'Main Square',
    longitude: 19.9374,
    latitude: 50.0619,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'station-3',
    name: 'University Campus',
    longitude: 19.9231,
    latitude: 50.0688,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'station-4',
    name: 'Shopping Mall',
    longitude: 19.9512,
    latitude: 50.0543,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'station-5',
    name: 'Airport Terminal',
    longitude: 19.7848,
    latitude: 50.0777,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
];

@injectable()
export class StationRepository implements IStationRepository {
  private stations: Map<string, StationRecord> = new Map(predefinedStations.map((s) => [s.id, s]));

  async findById(id: string): Promise<Station | null> {
    const record = this.stations.get(id);
    if (!record || record.deletedAt !== null) {
      return null;
    }
    return StationMapper.toDomain(record);
  }

  async findByName(name: string): Promise<Station | null> {
    for (const record of this.stations.values()) {
      if (record.name === name && record.deletedAt === null) {
        return StationMapper.toDomain(record);
      }
    }
    return null;
  }

  async findAll(pagination: Pagination): Promise<PaginatedResult<Station>> {
    const allRecords = Array.from(this.stations.values()).filter((r) => r.deletedAt === null);

    const total = allRecords.length;
    const paginatedRecords = allRecords.slice(
      pagination.offset,
      pagination.offset + pagination.limit
    );

    return new PaginatedResult(paginatedRecords.map(StationMapper.toDomain), pagination, total);
  }

  async create(station: Station): Promise<Station> {
    const record = StationMapper.toPersistence(station);
    this.stations.set(record.id, record);
    return StationMapper.toDomain(record);
  }

  async update(station: Station): Promise<Station> {
    const record = StationMapper.toPersistence(station);
    this.stations.set(record.id, record);
    return StationMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    this.stations.delete(id);
  }
}
