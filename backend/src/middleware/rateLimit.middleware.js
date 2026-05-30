const rateLimit = require("express-rate-limit");
const config = require('../config');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isDevelopment ? 10_000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isDevelopment ? 10_000 : 10,
    message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};