import { PASSWORD_REGEX } from '../helpers/contants';
import Joi from 'joi';

export const joiPasswordValidation = Joi.string().required().min(8).regex(PASSWORD_REGEX);


export const RegisterUserBodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: joiPasswordValidation,
});

export interface RegisterUserBody {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

