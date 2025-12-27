export type UserRole = 'admin' | 'user' | 'application_manager';

export class User {
  constructor(
    public readonly id: string,
    public readonly pesel: string,
    public readonly passwordHash: string,
    public readonly passwordSalt: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly balance: number,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static create(
    id: string,
    pesel: string,
    passwordHash: string,
    passwordSalt: string,
    firstName: string,
    lastName: string,
    balance: number,
    role: UserRole = 'user'
  ): User {
    return new User(
      id,
      pesel,
      passwordHash,
      passwordSalt,
      firstName,
      lastName,
      balance,
      role,
      new Date(),
      new Date(),
      null
    );
  }
}
