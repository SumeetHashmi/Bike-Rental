import * as express from 'express';
import { Response, Request } from 'express';
import { Db } from '../../database/db';
import { Logger } from '../../helpers/logger';
import { genericError, RequestBody, RequestQuery } from '../../helpers/utils';
import * as UserModel from '../../model/user.model';
import { UserService } from '../services/user.service';
import { Entities, Hash } from '../../helpers';
import { AppError } from '../../helpers/errors';

export class UserController {
  public router: express.Router;

  constructor() {
    Logger.info('User controller initialized...');
    this.router = express.Router();
    this.UserRouter();
  }

  private UserRouter(): void {
    this.router.get('/', async (req: Request, res: Response) => {
      let body;
      try {
        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });

        const UserDetails = await service.GetUserData(req.userId);

        body = {
          data: UserDetails,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.get('/bikes', async (req: Request, res: Response) => {
      let body;
      try {
        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });

        const bikeDetails = await service.GetBikes();

        body = {
          data: bikeDetails,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.post('/reserved-bikes', async (req: RequestBody<UserModel.BikeReservationModel>, res: Response) => {
      let body;
      try {
        await UserModel.BikeReservationModelSchema.validateAsync(req.body, {
          abortEarly: false,
        });

        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });

        const bikeDetails = await service.ReservedBikes(req.body);

        body = {
          data: bikeDetails,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
  }
}
