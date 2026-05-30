const Joi = require('joi');

const createSchema = Joi.object({
  title: Joi.string().required().min(5),
  content: Joi.string().required().min(10),
});

const updateSchema = Joi.object({
  title: Joi.string().optional().min(5),
  content: Joi.string().optional().min(10),
});

module.exports = { createSchema, updateSchema };
