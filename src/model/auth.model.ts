import { PASSWORD_REGEX } from '../helpers/contants';
import Joi from 'joi';

export const joiPasswordValidation = Joi.string().required().min(8).regex(PASSWORD_REGEX);

export const RegisterUserBodySchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: joiPasswordValidation,
});

export const LoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: joiPasswordValidation,
});

export const GenerateOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export interface RegisterUserBody {
  userName: string;
  email: string;
  password: string;
  type?: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
