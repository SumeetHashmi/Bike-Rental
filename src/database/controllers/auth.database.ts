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

  async DeleteRecoveryOtp(data: Partial<Entities.OtpVerifications>): Promise<void> {
    this.logger.info('Db.DeleteRecoveryOtp', { data });

    const knexdb = this.GetKnex();

    const query = knexdb('otpVerifications').where(data).del();

    const { err } = await this.RunQuery(query);

    if (err) {
      this.logger.error(' Db.DeleteRecoveryOtp Error deleting OTP', err);
      throw new AppError(500, 'Error deleting OTP');
    }
  }

  async StoreOTP(data: Partial<Entities.OtpVerifications>): Promise<void> {
    this.logger.info('Db.StoreOTP', { data });

    const knexdb = this.GetKnex();

    await this.DeleteRecoveryOtp(data);

    const query = knexdb('otpVerifications').insert(data);

    const { err } = await this.RunQuery(query);

    if (err) {
      this.logger.error('Db.StoreOTP error', err);
      throw new AppError(400, 'Failed to store OTP');
    }
  }
  async GetRecoveryOtp(where: Partial<Entities.OtpVerifications>): Promise<Entities.OtpVerifications | undefined> {
    this.logger.info('Db.GetRecoveryOtp', where);

    const knexdb = this.GetKnex();

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const query = knexdb('otpVerifications').select('*').where(where).where('createdAt', '>', fiveMinutesAgo);

    const { res, err } = await this.RunQuery(query);

    if (err) throw new AppError(400, err);

    if (!res || res.length === 0) {
      this.logger.info(' Db.CheckRecoveryOtp No valid OTP found');
      return undefined;
    }

    return res[0];
  }
}
