const cron = require('node-cron');
const { runAnalyticsJob } = require('./analytics.job');

const SIMULATED_TODAY = new Date('2026-03-12');

function startScheduler() {
  console.log('Starting job scheduler (simulated date: 2026-03-12)…');

  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Running hourly analytics job (simulated)…');
    await runAnalyticsJob('hourly', SIMULATED_TODAY);
  });

  cron.schedule('0 0 * * *', async () => {
    console.log('[Scheduler] Running daily analytics job (simulated)…');
    await runAnalyticsJob('daily', SIMULATED_TODAY);
  });

  cron.schedule('0 1 * * 0', async () => {
    console.log('[Scheduler] Running weekly analytics job (simulated)…');
    await runAnalyticsJob('weekly', SIMULATED_TODAY);
  });

  cron.schedule('0 2 1 * *', async () => {
    console.log('[Scheduler] Running monthly analytics job (simulated)…');
    await runAnalyticsJob('monthly', SIMULATED_TODAY);
  });

  console.log('Job scheduler started.');
}

function stopScheduler() {
  console.log('Stopping job scheduler…');
}

module.exports = { startScheduler, stopScheduler };