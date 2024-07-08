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
        if (!req.userId && !req.managerId) throw new AppError(400, 'Unauthorized');

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

    this.router.get('/bikes', async (req: RequestQuery<{ model?: string; location?: string }>, res: Response) => {
      let body;
      try {
        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });

        const bikeDetails = await service.GetBikes(req.query);

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

        const bikeDetails = await service.ReservedBikes(req.body, req.userId);

        body = {
          data: bikeDetails,
        };
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });

    this.router.delete('/cancel-reservation/:id', async (req: Request, res: Response) => {
      let body;
      try {
        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });
        const ReservationId = req.params.id;

        await service.DeleteReservation(ReservationId);
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
    this.router.post('/rating', async (req: RequestBody<UserModel.BikeRatingModel>, res: Response) => {
      let body;
      try {
        await UserModel.BikeRatingModelSchema.validateAsync(req.body, {
          abortEarly: false,
        });

        if (!req.userId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new UserService({ db });
        const bikeDetails = await service.AddRating(req.body, req.userId);

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
