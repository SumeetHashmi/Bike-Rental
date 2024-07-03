import * as express from 'express';
import { Response, Request } from 'express';
import { Db } from '../../database/db';
import { Logger } from '../../helpers/logger';
import { genericError, RequestBody, RequestQuery } from '../../helpers/utils';
import * as ManagerModel from '../../model/manager.model';
import { UserService } from '../services/user.service';
import { Entities, Hash } from '../../helpers';
import { ManagerService } from '../services/manager.service';
import { AppError } from '../../helpers/errors';

export class ManagerController {
  public router: express.Router;

  constructor() {
    Logger.info('Manager controller initialized...');
    this.router = express.Router();
    this.ManagerRouter();
  }

  private ManagerRouter(): void {
    this.router.post('/bike', async (req: RequestBody<ManagerModel.CreateBikeBody>, res: Response) => {
      let body;
      try {
        await ManagerModel.CreateBikeBodySchema.validateAsync(req.body, {
          abortEarly: false,
        });
        if (!req.managerId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new ManagerService({ db });

        await service.CreateBike(req.body);
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
    this.router.put('/bike/:id', async (req: RequestBody<Partial<Entities.BikeDetails>>, res: Response) => {
      let body;
      try {
        await ManagerModel.UpdateBikeSchema.validateAsync(req.body, {
          abortEarly: false,
        });
        if (!req.managerId) throw new AppError(400, 'Unauthorized');

        const db = res.locals.db as Db;

        const service = new ManagerService({ db });
        const BikeId = req.params.id;

        await service.UpdateBike(BikeId, req.body);
      } catch (error) {
        genericError(error, res);
      }
      res.json(body);
    });
  }
}
