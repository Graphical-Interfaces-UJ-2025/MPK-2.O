import { injectable } from 'tsyringe';
import { Transport } from '../../domain/entities';
import { TransportMapper, TransportRecord } from '../../domain/mappers';
import { ITransportRepository } from '../../application/repositories';
import { Pagination } from '../../../shared/application/query/pagination.query';
import { PaginatedResult } from '../../../shared/application/query/paginated-result.query';

const predefinedTransports: TransportRecord[] = [
  {
    id: 'transport-1',
    referenceNumber: '144',
    type: 'autobus',
    directionName: 'Bronowice - Dworzec Główny',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'transport-2',
    referenceNumber: '1',
    type: 'tram',
    directionName: 'Salwator - Wzgórza Krzesławickie',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'transport-3',
    referenceNumber: '52',
    type: 'tram',
    directionName: 'Krowodrza Górka - Łagiewniki',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'transport-4',
    referenceNumber: '252',
    type: 'autobus',
    directionName: 'Balice Airport - Główny',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
  {
    id: 'transport-5',
    referenceNumber: '10',
    type: 'tram',
    directionName: 'Pleszów - Łagiewniki',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  },
];

@injectable()
export class TransportRepository implements ITransportRepository {
  private transports: Map<string, TransportRecord> = new Map(
    predefinedTransports.map((t) => [t.id, t])
  );

  async findById(id: string): Promise<Transport | null> {
    const record = this.transports.get(id);
    if (!record || record.deletedAt !== null) {
      return null;
    }
    return TransportMapper.toDomain(record);
  }

  async findByReferenceNumber(referenceNumber: string): Promise<Transport | null> {
    for (const record of this.transports.values()) {
      if (record.referenceNumber === referenceNumber && record.deletedAt === null) {
        return TransportMapper.toDomain(record);
      }
    }
    return null;
  }

  async findAll(pagination: Pagination): Promise<PaginatedResult<Transport>> {
    const allRecords = Array.from(this.transports.values()).filter((r) => r.deletedAt === null);

    const total = allRecords.length;
    const paginatedRecords = allRecords.slice(
      pagination.offset,
      pagination.offset + pagination.limit
    );

    return new PaginatedResult(paginatedRecords.map(TransportMapper.toDomain), pagination, total);
  }

  async create(transport: Transport): Promise<Transport> {
    const record = TransportMapper.toPersistence(transport);
    this.transports.set(record.id, record);
    return TransportMapper.toDomain(record);
  }

  async update(transport: Transport): Promise<Transport> {
    const record = TransportMapper.toPersistence(transport);
    this.transports.set(record.id, record);
    return TransportMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    this.transports.delete(id);
  }
}
