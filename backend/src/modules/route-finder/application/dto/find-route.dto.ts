export type Location =
  | { type: 'station'; stationId: string }
  | { type: 'point'; longitude: number; latitude: number };

export class FindRouteDto {
  constructor(
    public readonly start: Location,
    public readonly destination: Location
  ) {}

  static fromRequest(body: {
    start: { stationId?: string; point?: { longitude: number; latitude: number } };
    destination: { stationId?: string; point?: { longitude: number; latitude: number } };
  }): FindRouteDto {
    const start: Location = body.start.stationId
      ? { type: 'station', stationId: body.start.stationId }
      : {
          type: 'point',
          longitude: body.start.point!.longitude,
          latitude: body.start.point!.latitude,
        };

    const destination: Location = body.destination.stationId
      ? { type: 'station', stationId: body.destination.stationId }
      : {
          type: 'point',
          longitude: body.destination.point!.longitude,
          latitude: body.destination.point!.latitude,
        };

    return new FindRouteDto(start, destination);
  }
}
