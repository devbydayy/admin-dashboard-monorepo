const express = require('express');
const cors    = require('cors');
const path    = require('path');
const config  = require('./config');
const routes  = require('./routes');
const { errorMiddleware }           = require('./middleware/error.middleware');
const { apiLimiter, authLimiter }   = require('./middleware/rateLimit.middleware');
const { prisma }                    = require('./db/prisma');

const app = express();

app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

if (config.isDevelopment) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
}

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

module.exports = { app, prisma, config };