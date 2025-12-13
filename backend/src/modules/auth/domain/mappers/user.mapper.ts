import { User } from '../entities/user.entity';
import { UserRecord, NewUserRecord } from '../../infrastructure/database/models/user.model';

export class UserMapper {
  static toDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.email,
      record.passwordHash,
      record.firstName,
      record.lastName,
      record.createdAt,
      record.updatedAt
    );
  }

  static toPersistence(user: User): NewUserRecord {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
