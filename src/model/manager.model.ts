import { PASSWORD_REGEX } from '../helpers/contants';
import Joi from 'joi';
import { UserType } from '../helpers/entities';

export const joiPasswordValidation = Joi.string().required().min(8).regex(PASSWORD_REGEX);

export interface CreateBikeBody {
  bikeModel: string;
  bikeColor: string;
  location: string;
}

export interface RegisterUserBody {
  userName: string;
  email: string;
  password: string;
  type?: UserType;
}

export const RegisterUserBodySchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: joiPasswordValidation,
  type: Joi.string().required(),
});

export const CreateBikeBodySchema = Joi.object({
  bikeModel: Joi.string().required(),
  bikeColor: Joi.string().required(),
  location: Joi.string().required(),
});

export const UpdateBikeSchema = Joi.object({
  bikeModel: Joi.string().optional(),
  bikeColor: Joi.string().optional(),
  location: Joi.string().optional(),
});
