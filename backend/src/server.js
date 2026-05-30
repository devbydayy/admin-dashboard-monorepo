const { app, prisma, config } = require('./app');
const { initializeSocket } = require('./sockets');
const { startScheduler } = require('./jobs/scheduler');

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
  console.info(`Environment: ${config.nodeEnv}`);
  initializeSocket(server);
  startScheduler();
});

process.on('SIGTERM', async () => {
  console.info('SIGTERM received, closing server...');
  await prisma.$disconnect();
  server.close(() => { console.info('Server closed'); process.exit(0); });
});

process.on('SIGINT', async () => {
  console.info('SIGINT received, closing server...');
  await prisma.$disconnect();
  server.close(() => { console.info('Server closed'); process.exit(0); });
});