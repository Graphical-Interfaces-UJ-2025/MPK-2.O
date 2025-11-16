import { User } from '../../../auth/domain/entities/user.entity';
import { UserModel } from '../../infrastructure/database/models/user.model';

export class UserMapper {
  static toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.password_hash,
      model.first_name,
      model.last_name,
      model.created_at,
      model.updated_at
    );
  }

  static toPersistence(user: User): Partial<UserModel> {
    return {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
      first_name: user.firstName,
      last_name: user.lastName,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
