import Joi from 'joi';

export const createBookSchema = Joi.object({
  name: Joi.string().required().min(1).max(255)
});

export const borrowBookSchema = Joi.object({
  userId: Joi.number().required().positive()
});

export const returnBookSchema = Joi.object({
  score: Joi.number().required().min(1).max(10)
}); 