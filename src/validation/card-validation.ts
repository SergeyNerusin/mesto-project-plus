import { Joi, celebrate } from 'celebrate';
import { regExpUrl, regExpUrlPicture } from '../utils/constant';

export const cardDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regExpUrl).pattern(regExpUrlPicture).required(),
  }),
});

export const idCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
