export class Track {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly transportRefNumber: string,
    public readonly stationIds: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null
  ) {}

  static create(id: number, name: string, transportRefNumber: string, stationIds: string[]): Track {
    return new Track(id, name, transportRefNumber, [...stationIds], new Date(), new Date(), null);
  }

  update(name: string, transportRefNumber: string, stationIds: string[]): Track {
    return new Track(
      this.id,
      name,
      transportRefNumber,
      [...stationIds],
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  softDelete(): Track {
    return new Track(
      this.id,
      this.name,
      this.transportRefNumber,
      [...this.stationIds],
      this.createdAt,
      new Date(),
      new Date()
    );
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  get finalStationId(): string | undefined {
    return this.stationIds.length > 0 ? this.stationIds[this.stationIds.length - 1] : undefined;
  }
}
