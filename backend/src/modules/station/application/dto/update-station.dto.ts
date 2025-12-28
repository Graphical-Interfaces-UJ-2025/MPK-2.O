export class UpdateStationDto {
  constructor(
    public readonly name: string,
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
