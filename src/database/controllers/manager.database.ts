/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { Knex } from 'knex';
import { Entities } from '../../helpers';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as UserModel from '../../model/auth.model';
import { DatabaseErrors } from '../../helpers/contants';
import * as ManagerModel from '../../model/manager.model';

export class ManagerDatabase {
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
  async CreateBike(bikeData: ManagerModel.CreateBikeBody): Promise<string> {
    this.logger.info('Db.CreateUser', { bikeData });

    const knexdb = this.GetKnex();

    const query = knexdb('bikeDetails').insert(bikeData, 'id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not created `);
    }

    if (!res || res.length !== 1) {
      this.logger.info('Db.CreateUser User not created', err);

      throw new AppError(400, `User not created `);
    }

    const { id } = res[0];
    return id;
  }
  async UpdateBike(where: Partial<Entities.BikeDetails>, toUpdate: Partial<Entities.BikeDetails>) {
    this.logger.info('Db.UpdateBike', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('bikeDetails').where(where).update(toUpdate).returning('id');

    const { res, err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not updated`);
    }

    if (!res || res.length !== 1) {
      this.logger.info('Db.UpdateBike Bike not updated', err);

      throw new AppError(400, `Bike not updated `);
    }

    const { id } = res[0];
    return id;
  }
  async DeleteBike(where: Partial<Entities.BikeDetails>) {
    this.logger.info('Db.UpdateBike', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('bikeDetails').where(where).del();

    const { err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `Bike not deleted`);
    }
  }
  async GetBikes(): Promise<Entities.BikeDetails[] | undefined> {
    this.logger.info('Db.UpdateBike');

    const knexdb = this.GetKnex();

    const query = knexdb('bikeDetails').select('*', knexdb.raw(`5 as "averageRating"`));

    const { res, err } = await this.RunQuery(query);

    if (res?.length === 0) {
      return undefined;
    }

    if (err) {
      this.logger.error('Db.UpdateBike');
    }
    return res;
  }

  async DeleteUser(where: Partial<Entities.BikeDetails>) {
    this.logger.info('Db.DeleteUser', { where });

    const knexdb = this.GetKnex();

    const query = knexdb('users').where(where).del();

    const { err } = await this.RunQuery(query);

    if (err) {
      throw new AppError(400, `User not deleted`);
    }
  }

}
