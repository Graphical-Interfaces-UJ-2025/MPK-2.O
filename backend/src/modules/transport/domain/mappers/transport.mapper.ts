import { Transport, TransportType } from '../entities';

export interface TransportRecord {
  id: string;
  referenceNumber: string;
  type: TransportType;
  directionName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class TransportMapper {
  static toDomain(record: TransportRecord): Transport {
    return new Transport(
      record.id,
      record.referenceNumber,
      record.type,
      record.directionName,
      record.createdAt,
      record.updatedAt,
      record.deletedAt
    );
  }

  static toPersistence(transport: Transport): TransportRecord {
    return {
      id: transport.id,
      referenceNumber: transport.referenceNumber,
      type: transport.type,
      directionName: transport.directionName,
      createdAt: transport.createdAt,
      updatedAt: transport.updatedAt,
      deletedAt: transport.deletedAt,
    };
  }
}
