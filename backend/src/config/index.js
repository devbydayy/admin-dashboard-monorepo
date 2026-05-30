require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-me',
  dbUrl: process.env.DATABASE_URL,
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN || 'http://localhost:3000'
      : /^http:\/\/localhost:\d+$/,
    credentials: true,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  webhookSecret: process.env.WEBHOOK_SECRET || "whsec_demo_secret_key_change_me",
};

module.exports = config;