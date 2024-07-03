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
  async CreateBike(bikeData: Partial<ManagerModel.CreateBikeBody>): Promise<string> {
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
}
