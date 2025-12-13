import { injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { IUserRepository } from '../../application/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { users } from '../database/models/user.model';
import { UserMapper } from '../../domain/mappers/user.mapper';
import { db } from '../../../../config/database.config';

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const [record] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [record] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return record ? UserMapper.toDomain(record) : null;
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const [record] = await db.insert(users).values(data).returning();
    return UserMapper.toDomain(record);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const [record] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
    return UserMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async findAll(): Promise<User[]> {
    const records = await db.select().from(users);
    return records.map(UserMapper.toDomain);
  }
}
