import { Db } from '../../database/db';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import { Entities, Hash } from '../../helpers';
import * as UserModels from '../../model/user.model';
import * as AuthModel from '../../model/auth.model';
import { UserType } from '../../helpers/entities';
import * as Token from '../../helpers/token';

export class UserService {
  private db: Db;

  constructor(args: { db: Db }) {
    Logger.info('UserService initialized...');
    this.db = args.db;
  }

  public async GetUser(where: Partial<Entities.User>): Promise<void> {
    Logger.info('UserService.GetUser', { where });
  }

  public async GetUserData(id: string): Promise<UserModels.GetUser | undefined> {
    Logger.info('User.UserData', id);

    const UserData = await this.db.User.GetUser({ id });

    if (!UserData) throw new AppError(400, 'No user exist ');

    const previousReservations = await this.db.User.GetReservation({ userId: id });

    return { ...UserData, previousReservations };
  }

  public async GetBikes(data: Entities.QueryData): Promise<Entities.BikeDetails[] | undefined> {
    Logger.info('User.UpdateBike');

    const BikesData = await this.db.User.GetBikes(data);

    return BikesData;
  }
  public async ReservedBikes(bikeData: UserModels.BikeReservationModel, userId: string): Promise<void> {
    const date = new Date();
    Logger.info('User.CreateUser', bikeData.startDate < date.toString(), bikeData.endDate < bikeData.startDate);

    if (bikeData.startDate <= date.toISOString() || bikeData.endDate < bikeData.startDate) {
      throw new AppError(400, 'Please provide valid date ');
    }

    Logger.info('User.CreateUser', { bikeData });

    await this.db.User.ReservedBike({ userId, ...bikeData });
  }
  public async DeleteReservation(id: string): Promise<void> {
    Logger.info('User.UpdateBike', { id });

    await this.db.User.DeleteReservation({ id });
  }
  public async AddRating(ratingData: UserModels.BikeRatingModel, userId: string): Promise<void> {
    Logger.info('Manager.AddRating', { ratingData });

    const booking = await this.db.User.GetReservation({ id: ratingData.reservationId, userId: userId });

    if (!booking) throw new AppError(400, 'No booking exist');
    await this.db.User.UpdateRating({ id: ratingData.reservationId }, { rating: ratingData.rating });
  }
}
