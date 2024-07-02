//

import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import { UserType } from '../../helpers/entities';
import { Jwt } from '../../helpers/env';
import { Logger } from '../../helpers/logger';

export const jwtAuth = (req: Request, res: Response, next: NextFunction): void | Response => {
  try {
    const token: string = req.headers['access-token']?.toString() || '';

    if (!token) {
      Logger.debug('API_AUTH no token provided');
      return res.status(401).json({ Error: true, Msg: 'Unauthorized' });
    }

    const decoded: any = JWT.verify(token, Jwt.JWT_SECRET || '');

    if (decoded.isRefreshToken) {
      Logger.debug('API_AUTH refresh token provided');
      return res.status(400).json({ Error: true, Msg: 'Unauthorized' });
    }

    if (decoded.UserType === UserType.User) {
      req.userId = decoded.id;
    } else if (decoded.UserType === UserType.Manager) {
      req.managerId = decoded.id;
    }

    // req.userId = decoded.id;

    next();
  } catch (error) {
    Logger.debug('API_AUTH jwt error: ', error);
    if (error instanceof Error) {
      res.status(400).json({ Error: true, Msg: error.message });
    }
    res.status(400).json({ Error: true, Msg: `Unauthorized`, error });
  }
};
