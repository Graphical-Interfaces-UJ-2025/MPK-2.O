import { Track } from '../entities';

export interface TrackRecord {
  id: number;
  name: string;
  transportRefNumber: string;
  stationIds: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class TrackMapper {
  static toDomain(record: TrackRecord): Track {
    return new Track(
      record.id,
      record.name,
      record.transportRefNumber,
      [...record.stationIds],
      record.createdAt,
      record.updatedAt,
      record.deletedAt
    );
  }

  static toPersistence(track: Track): TrackRecord {
    return {
      id: track.id,
      name: track.name,
      transportRefNumber: track.transportRefNumber,
      stationIds: [...track.stationIds],
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
      deletedAt: track.deletedAt,
    };
  }
}
