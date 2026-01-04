export class RegisterUserDto {
  constructor(
    public readonly pesel: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}
