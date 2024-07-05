import { PASSWORD_REGEX } from '../helpers/contants';
import Joi from 'joi';
import { UserType } from '../helpers/entities';

export const joiPasswordValidation = Joi.string().required().min(8).regex(PASSWORD_REGEX);

export interface ManagerRegisterUserBody {
  userName: string;
  email: string;
  password: string;
  type?: UserType;
}

export interface PreviousReservations {
  id: string;
  bikeModel: string;
  bikeColor: string;
  location: string;
  startDate: string;
  endDate: string;
  averageRating: number;
}

export interface GetUser {
  id: string;
  userName: string;
  email: string;
  password: string;
  type: UserType;
  createdAt: string;
  updatedAt: string;
  previousReservations: PreviousReservations[];
}

export interface BikeReservationModel {
  userId: string;
  bikeId: string;
  startDate: string;
  endDate: string;
}

export const BikeReservationModelSchema = Joi.object({
  userId: Joi.string().required(),
  bikeId: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
});

export const ManagerRegisterUserBodySchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: joiPasswordValidation,
  type: Joi.string().required(),
});
