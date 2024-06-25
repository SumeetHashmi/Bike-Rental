/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { Knex } from 'knex';
import { Entities } from '../../helpers';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as UserModel from '../../model/auth.model';
import { DatabaseErrors } from '../../helpers/contants';

export class AuthDatabase {
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

  async StoreOTP(user: Partial<Entities.OtpVerifications>): Promise<void> {
    this.logger.info('Db.StoreOTP', { user });

    const knexdb = this.GetKnex();

    // Here, we assume you have a separate table to store OTPs or you can store it in the users table with an expiration timestamp
    const query = knexdb('otpVerifications').insert(user);

    const { res, err } = await this.RunQuery(query);

    if (err) {
      this.logger.error('Db.StoreOTP error', err);
      throw new AppError(400, 'Failed to store OTP');
    }
  }
}
