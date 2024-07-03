import { Db } from '../database/db';
import { Hash } from '../helpers';
import { Logger } from '../helpers/logger';
import { ManagerPassword } from '../helpers/env';
import { UserType } from '../helpers/entities';

export async function seedManager(db: Db) {
  try {
    const admin = await db.User.GetUser({ email: 'admin@bikerental.app' });
    if (admin) {
      Logger.info('Dummy Admin already exists');
      return;
    }
    const hashedPassword = await Hash.hashPassword(ManagerPassword.password);
    await db.User.CreateUser({
      userName: 'admin',
      email: 'admin@bikerental.app',
      password: hashedPassword,
      type: UserType.Manager,
    });

    Logger.info('Dummy Admin seeded successfully!');
  } catch (error) {
    Logger.error('Error seeding Admin', error);
  }
}
