import { UserRole } from '../../domain/entities/user.entity';

export class RegisterUserDto {
  constructor(
    public readonly pesel: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole = 'user'
  ) {}
}
