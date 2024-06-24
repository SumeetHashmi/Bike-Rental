import { Db } from '../../database/db';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as AuthModel from '../../model/auth.model';
import { Entities, Hash } from '../../helpers';
import * as Token from '../../helpers/token';

export class AuthService {
  private db: Db;

  constructor(args: { db: Db }) {
    Logger.info('AuthService initialized...');
    this.db = args.db;
  }

  public async CreateUser(user: Partial<Entities.User>): Promise<void> {
    Logger.info('AuthService.CreateUser', { user });

  }
}
