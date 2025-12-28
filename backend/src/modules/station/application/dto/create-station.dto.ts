export class CreateStationDto {
  constructor(
    public readonly name: string,
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
