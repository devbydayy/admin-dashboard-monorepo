const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required().min(3),
});

const updateSchema = Joi.object({
  name: Joi.string().optional().min(3),
});

module.exports = { createSchema, updateSchema };
