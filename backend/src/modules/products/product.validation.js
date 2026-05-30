const Joi = require('joi');

const createSchema = Joi.object({
  name:                Joi.string().required(),
  description:         Joi.string().optional().allow(''),
  price:               Joi.number().positive().required(),
  salePrice:           Joi.number().positive().optional().allow(null),
  discount:            Joi.number().min(0).max(100).optional(),
  stock:               Joi.number().integer().min(0).required(),
  imageUrl:            Joi.string().optional().allow('', null),
  images:              Joi.string().optional().allow('', null),
  categoryId:          Joi.string().optional().allow('', null),
  status:              Joi.string().valid('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK').optional(),

  sku:                 Joi.string().optional().allow('', null),
  brand:               Joi.string().optional().allow('', null),
  weight:              Joi.number().positive().optional().allow(null),
  productType:         Joi.string().optional().allow('', null),
  features:            Joi.string().optional().allow('', null),
  taxClass:            Joi.string().optional().allow('', null),
  taxRate:             Joi.number().min(0).max(100).optional().allow(null),
  lowStockThreshold:   Joi.number().integer().min(0).optional().allow(null),
  warehouse:           Joi.string().optional().allow('', null),
  warehouseLocation:   Joi.string().optional().allow('', null),
  lowStockAlertEnabled:Joi.boolean().optional(),
});

const updateSchema = Joi.object({
  name:                Joi.string().optional(),
  description:         Joi.string().optional().allow(''),
  price:               Joi.number().positive().optional(),
  salePrice:           Joi.number().positive().optional().allow(null),
  discount:            Joi.number().min(0).max(100).optional(),
  stock:               Joi.number().integer().min(0).optional(),
  imageUrl:            Joi.string().optional().allow('', null),
  images:              Joi.string().optional().allow('', null),
  categoryId:          Joi.string().optional().allow('', null),
  status:              Joi.string().valid('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK').optional(),

  sku:                 Joi.string().optional().allow('', null),
  brand:               Joi.string().optional().allow('', null),
  weight:              Joi.number().positive().optional().allow(null),
  productType:         Joi.string().optional().allow('', null),
  features:            Joi.string().optional().allow('', null),
  taxClass:            Joi.string().optional().allow('', null),
  taxRate:             Joi.number().min(0).max(100).optional().allow(null),
  lowStockThreshold:   Joi.number().integer().min(0).optional().allow(null),
  warehouse:           Joi.string().optional().allow('', null),
  warehouseLocation:   Joi.string().optional().allow('', null),
  lowStockAlertEnabled:Joi.boolean().optional(),
});

module.exports = { createSchema, updateSchema };