export class GeographicalLocation {
  constructor(
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}

export class Station {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly location: GeographicalLocation,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null
  ) {}

  static create(id: string, name: string, longitude: number, latitude: number): Station {
    return new Station(
      id,
      name,
      new GeographicalLocation(longitude, latitude),
      new Date(),
      new Date(),
      null
    );
  }

  update(name: string, longitude: number, latitude: number): Station {
    return new Station(
      this.id,
      name,
      new GeographicalLocation(longitude, latitude),
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  softDelete(): Station {
    return new Station(this.id, this.name, this.location, this.createdAt, new Date(), new Date());
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
