const Joi = require('joi');

const createSchema = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
});

const updateSchema = Joi.object({
  status: Joi.string()
    .valid(
      'PENDING',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED'
    )
    .optional(),
  total: Joi.number().optional(),
});

module.exports = { createSchema, updateSchema };
