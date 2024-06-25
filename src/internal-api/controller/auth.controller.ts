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
        const userData = { ...req.body, type: 'user' };
        const db = res.locals.db as Db;

        const service = new AuthService({ db });

        const response = await service.CreateUser(userData);

        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
    this.router.post('/login', async (req: RequestBody<AuthModel.LoginUser>, res: Response) => {
      let body;
      try {
        // Validate request body
        await AuthModel.LoginUserSchema.validateAsync(req.body, {
          abortEarly: false,
        });

        const db = res.locals.db as Db;
        const service = new AuthService({ db });

        // Perform login
        const response = await service.LoginUser(req.body);

        body = {
          data: response,
        };
      } catch (error) {
        genericError(error, res);
        return; // Ensure that the response is not sent multiple times
      }
      res.json(body);
    });
    this.router.post('/generate-otp', async (req: RequestBody<{ email: string }>, res: Response) => {
      let body;
      try {
        await AuthModel.GenerateOtpSchema.validateAsync(req.body, {
          abortEarly: false,
        });

        const db = res.locals.db as Db;
        const service = new AuthService({ db });

        // Generate OTP
        const otp = await service.GenerateOTP(req.body.email);

        body = {
          data: { message: 'OTP sent successfully' },
        };
      } catch (error) {
        genericError(error, res);
        return; // Ensure that the response is not sent multiple times
      }
      res.json(body);
    });
  }
}
