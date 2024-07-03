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
}
