export type UserRole = 'admin' | 'user' | 'application_manager';

export class User {
  constructor(
    public readonly id: string,
    public readonly pesel: string,
    public readonly email: string,
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

  addBalance(amount: number): User {
    return new User(
      this.id,
      this.pesel,
      this.email,
      this.passwordHash,
      this.passwordSalt,
      this.firstName,
      this.lastName,
      this.balance + amount,
      this.role,
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  deductBalance(amount: number): User {
    if (this.balance < amount) {
      throw new Error('Insufficient balance');
    }
    return new User(
      this.id,
      this.pesel,
      this.email,
      this.passwordHash,
      this.passwordSalt,
      this.firstName,
      this.lastName,
      this.balance - amount,
      this.role,
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  static create(
    id: string,
    pesel: string,
    email: string,
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
      email,
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
