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

    if (!UserData) throw new AppError(400, 'No uiser exist ');

    const previousReservations = [
      {
        id: '1',
        bikeModel: 'Mountain X200',
        bikeColor: 'Red',
        location: 'Downtown Bike Shop',
        startDate: '2024-05-01',
        endDate: '2024-05-07',
        averageRating: 4.5,
      },
      {
        id: '2',
        bikeModel: 'City Cruiser 300',
        bikeColor: 'Blue',
        location: 'Uptown Bike Rentals',
        startDate: '2024-06-10',
        endDate: '2024-06-15',
        averageRating: 4.8,
      },
    ];

    return { ...UserData, previousReservations };
  }

  public async GetBikes(): Promise<Entities.BikeDetails[] | undefined> {
    Logger.info('User.UpdateBike');

    const BikesData = await this.db.User.GetBikes();

    return BikesData;
  }
  public async ReservedBikes(bikeData: UserModels.BikeReservationModel): Promise<void> {
    Logger.info('User.CreateUser', { bikeData });

    await this.db.User.ReservedBike(bikeData);
  }
  public async DeleteReservation(id: string): Promise<void> {
    Logger.info('User.UpdateBike', { id });

    await this.db.User.DeleteReservation({ id });
  }
  public async AddRating(ratingData: UserModels.BikeRatingModel, userId: string): Promise<void> {
    Logger.info('Manager.AddRating', { ratingData });

    const booking = await this.db.User.GetRating({ id: ratingData.reservationId, userId: userId });

    if (!booking) throw new AppError(400, 'No booking exist');
    await this.db.User.UpdateRating({ id: ratingData.reservationId }, { rating: ratingData.rating });
  }
}
