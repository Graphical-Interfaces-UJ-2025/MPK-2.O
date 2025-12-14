export class LoginUserDto {
  constructor(
    public readonly pesel: string,
    public readonly password: string
  ) {}
}
