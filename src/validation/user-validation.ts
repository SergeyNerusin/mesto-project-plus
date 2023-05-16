import { Joi, celebrate } from 'celebrate';
import { regExpUrl, regExpUrlPicture } from '../utils/constant';

export const userDataValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExpUrl).pattern(regExpUrlPicture),
  }),
});

export const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const idValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).required(),
  }),
});

export const aboutUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExpUrl).pattern(regExpUrlPicture),
  }),
});
