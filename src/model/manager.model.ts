import { PASSWORD_REGEX } from '../helpers/contants';
import Joi from 'joi';
import { UserType } from '../helpers/entities';

export const joiPasswordValidation = Joi.string().required().min(8).regex(PASSWORD_REGEX);

export interface CreateBikeBody {
  bikeModel: string;
  bikeColor: string;
  location: string;
}

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
