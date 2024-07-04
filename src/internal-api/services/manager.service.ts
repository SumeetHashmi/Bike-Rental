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

  public async DeleteBike(id: string): Promise<void> {
    Logger.info('Manager.UpdateBike', { id });

    await this.db.Manager.DeleteBike({ id });
  }

  public async GetBikes(): Promise<Entities.BikeDetails[] | undefined> {
    Logger.info('Manager.UpdateBike');

    const BikesData = await this.db.Manager.GetBikes();
    let updatedBikesData;
    if (BikesData) {
      const reservationData = [
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          type: 'manager',
          startDate: '2024-06-25T14:00:00',
          endDate: '2024-06-26T14:00:00',
        },
        {
          name: 'Local Smith',
          email: 'local@example.com',
          type: 'user',
          startDate: '2024-06-25T14:00:00',
          endDate: '2024-06-26T14:00:00',
        },
      ];

      updatedBikesData = BikesData.map((bike) => ({ ...bike, reservation: reservationData }));
    } else {
      Logger.info('BikeData is undefined');
    }

    return updatedBikesData;
  }
  public async CreateUser(user: ManagerModel.RegisterUserBody): Promise<void> {
    Logger.info('AuthService.CreateUser', { user });

    const hashedPassword = await Hash.hashPassword(user.password);
    user.password = hashedPassword;

    await this.db.User.CreateUser(user);
  }
}
