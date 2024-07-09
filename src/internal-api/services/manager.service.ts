import { Db } from '../../database/db';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import { Entities, Hash } from '../../helpers';
import * as UserModels from '../../model/auth.model';
import * as AuthModel from '../../model/auth.model';
import { UserType } from '../../helpers/entities';
import * as Token from '../../helpers/token';
import * as ManagerModel from '../../model/manager.model';

export class ManagerService {
  private db: Db;

  constructor(args: { db: Db }) {
    Logger.info('UserService initialized...');
    this.db = args.db;
  }

  public async CreateBike(bikeData: ManagerModel.CreateBikeBody): Promise<void> {
    Logger.info('Manager.CreateUser', { bikeData });

    await this.db.Manager.CreateBike(bikeData);
  }

  public async UpdateBike(id: string, bikeData: Partial<Entities.BikeDetails>): Promise<void> {
    Logger.info('Manager.UpdateBike', { bikeData });

    await this.db.Manager.UpdateBike({ id }, bikeData);
  }

  public async UpdateUser(id: string, userData: Partial<Entities.BikeDetails>): Promise<void> {
    Logger.info('Manager.UpdateBike', { userData });

    await this.db.Manager.UpdateUser({ id }, userData);
  }

  public async DeleteBike(id: string): Promise<void> {
    Logger.info('Manager.UpdateBike', { id });

    await this.db.Manager.DeleteBike({ id });
  }

  public async GetBikes(filters: Partial<Entities.BikeDetails>): Promise<Entities.BikeDetails[] | undefined> {
    Logger.info('Manager.UpdateBike', filters);

    const BikesData = await this.db.Manager.GetBikes(filters);

    return BikesData;
  }

  public async GetUsers(filters: Partial<Entities.FilterUser>): Promise<Entities.User[] | undefined> {
    Logger.info('DB.manager.GetUser', filters);

    const UsersData = await this.db.Manager.GetUsers(filters);

    return UsersData;
  }

  public async CreateUser(user: ManagerModel.ManagerRegisterUserBody): Promise<void> {
    Logger.info('AuthService.CreateUser', { user });

    const hashedPassword = await Hash.hashPassword(user.password);
    user.password = hashedPassword;

    await this.db.User.CreateUser(user);
  }
  public async DeleteUser(id: string): Promise<void> {
    Logger.info('Manager.DeleteUser', { id });

    await this.db.Manager.DeleteUser({ id });
  }
}
