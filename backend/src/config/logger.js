const winston = require('winston');

const transports = [
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    })
  );

  transports.push(
    new winston.transports.File({
      filename: 'combined.log',
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;
