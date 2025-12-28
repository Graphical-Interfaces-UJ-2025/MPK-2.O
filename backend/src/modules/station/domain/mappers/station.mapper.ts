import { Station, GeographicalLocation } from '../entities';

export interface StationRecord {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class StationMapper {
  static toDomain(record: StationRecord): Station {
    return new Station(
      record.id,
      record.name,
      new GeographicalLocation(record.longitude, record.latitude),
      record.createdAt,
      record.updatedAt,
      record.deletedAt
    );
  }

  static toPersistence(station: Station): StationRecord {
    return {
      id: station.id,
      name: station.name,
      longitude: station.location.longitude,
      latitude: station.location.latitude,
      createdAt: station.createdAt,
      updatedAt: station.updatedAt,
      deletedAt: station.deletedAt,
    };
  }
}
