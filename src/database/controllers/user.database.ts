/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { Knex } from 'knex';
import { Entities } from '../../helpers';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as UserModel from '../../model/user.model';
import { DatabaseErrors } from '../../helpers/contants';

export class UserDatabase {
  private logger: typeof Logger;

  private GetKnex: () => Knex;

  private RunQuery: (query: Knex.QueryBuilder) => Promise<{ res?: any[]; err: any }>;

  public constructor(args: {
    GetKnex: () => Knex;
    RunQuery: (query: Knex.QueryBuilder) => Promise<{ res?: any[]; err: any }>;
  }) {
    this.logger = Logger;
    this.GetKnex = args.GetKnex;
    this.RunQuery = args.RunQuery;
  }

  async CreateUser(user: Partial<Entities.User>): Promise<string> {
    this.logger.info('Db.CreateUser', { user });

    const knexdb = this.GetKnex();

    const query = knexdb('users').insert(user, 'id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      if (err.code === DatabaseErrors.DUPLICATE) {
        this.logger.error('Db.CreateUser failed due to duplicate key', err);

        throw new AppError(400, 'User already exists');
      }
      throw new AppError(400, `User not created `);
    }

    if (!res || res.length !== 1) {
      this.logger.info('Db.CreateUser User not created', err);

      throw new AppError(400, `User not created `);
    }

    const { id } = res[0];
    return id;
  }

  async GetUser(where: Partial<Entities.User>): Promise<Entities.User | undefined> {
    this.logger.info('Db.GetUser', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('users').select('*').where(where);

    const { res, err } = await this.RunQuery(query);

    if (err) return undefined;

    if (!res || res.length === 0) {
      this.logger.info('No user found', res);
      return undefined;
    }

    return res[0];
  }
  async UpdateUser(where: Partial<Entities.User>, toUpdate: Partial<Entities.User>) {
    this.logger.info('Db.UpdateUser', { where, toUpdate });

    const knexdb = this.GetKnex();

    const query = knexdb('users').where(where).update(toUpdate).returning('id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      this.logger.error('Db.UpdateUser Error updating user info', err);
      throw new AppError(500, `Error updating user  info `);
    }

    if (!res || res.length !== 1) {
      this.logger.error('Db.UpdateUser Update failed');
      throw new AppError(404, 'Update failed');
    }
  }
  async GetBikes(data: Entities.QueryData): Promise<Entities.BikeDetails[] | undefined> {
    this.logger.info('Db.UpdateBike');

    const knexdb = this.GetKnex();

    let query = knexdb('bikeDetails').select('*', knexdb.raw(`5 as "averageRating"`));
    if (data.location) {
      query = query.where({ 'bikeDetails.location': data.location });
    }
    if (data.model) {
      query = query.where({ 'bikeDetails.bikeModel': parseInt(data.model) });
    }

    const { res, err } = await this.RunQuery(query);

    if (res?.length === 0) {
      return undefined;
    }

    if (err) {
      this.logger.error('Db.UpdateBike');
    }
    return res;
  }
  async ReservedBike(bikeData: Partial<Entities.BookingDates>): Promise<string> {
    this.logger.info('Db.ReservedBike', { bikeData });

    const knexdb = this.GetKnex();

    const query = knexdb('bookingDates').insert(bikeData, 'id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not reserved `);
    }

    if (!res || res.length !== 1) {
      this.logger.info('Db.ReservedBike Bike not reserved ', err);

      throw new AppError(400, `Bike not reserved  `);
    }

    const { id } = res[0];
    return id;
  }
  async DeleteReservation(where: Partial<Entities.BikeDetails>) {
    this.logger.info('Db.DeleteReservation', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('bookingDates').where(where).del();

    const { err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not deleted`);
    }
  }
  async GetReservation(where: Partial<Entities.BookingDates>) {
    this.logger.info('Db.GetRGetReservationating', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('bookingDates')
      .select('bookingDates.*', 'bikeModel', 'bikeColor', 'location')
      .leftJoin('bikeDetails', 'bookingDates.bikeId', 'bikeDetails.id')
      .where(where);

    const { res, err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not reserved ${err}`);
    }

    if (!res) {
      this.logger.info('Db.ReservedBike Bike not reserved ', err);

      throw new AppError(400, `Bike not reserved  `);
    }

    return res;
  }

  async UpdateRating(where: Partial<Entities.BookingDates>, toUpdate: Partial<Entities.BookingDates>) {
    this.logger.info('Db.UpdateUser', { where, toUpdate });

    const knexdb = this.GetKnex();

    const query = knexdb('bookingDates').where(where).update(toUpdate).returning('id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      this.logger.error('Db.UpdateUser Error updating user info', err);
      throw new AppError(500, `Error updating user  info `);
    }

    if (!res || res.length !== 1) {
      this.logger.error('Db.UpdateUser Update failed');
      throw new AppError(404, 'Update failed');
    }
  }
}
