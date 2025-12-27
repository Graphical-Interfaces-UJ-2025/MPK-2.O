import { User } from '../entities/user.entity';
import { UserRecord, NewUserRecord } from '../../infrastructure/database/models/user.model';

export class UserMapper {
  static toDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.pesel,
      record.passwordHash,
      record.passwordSalt,
      record.firstName,
      record.lastName,
      record.balance,
      record.role,
      record.createdAt,
      record.updatedAt,
      record.deletedAt
    );
  }

  static toPersistence(user: User): NewUserRecord {
    return {
      id: user.id,
      pesel: user.pesel,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: user.balance,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
