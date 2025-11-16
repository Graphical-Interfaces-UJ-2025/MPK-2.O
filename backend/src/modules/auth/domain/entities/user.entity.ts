export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static create(
    id: string,
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string
  ): User {
    return new User(id, email, passwordHash, firstName, lastName, new Date(), new Date());
  }
}
