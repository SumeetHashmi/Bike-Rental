import * as express from 'express';
import { Response } from 'express';
import { Db } from '../../database/db';
import { Logger } from '../../helpers/logger';
import { genericError, RequestBody } from '../../helpers/utils';
import * as AuthModel from '../../model/auth.model';
import { AuthService } from '../services/auth.service';

export class AuthController {
  public router: express.Router;

  constructor() {
    Logger.info('Auth controller initialized...');

    this.router = express.Router();

    this.AuthRouter();
  }

  private AuthRouter(): void {
    this.router.post('/register', async (req: RequestBody<AuthModel.RegisterUserBody>, res: Response) => {
      let body;
      try {
        await AuthModel.RegisterUserBodySchema.validateAsync(req.body, {
          abortEarly: false,
        });

        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.CreateUser(req.body);

        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
  }
}
