require('dotenv/config');
const { runAnalyticsJob } = require('./src/jobs/analytics.job');

(async () => {
  try {
    const START = new Date('2025-12-12');
    const END   = new Date('2026-05-12');
    
    console.log('Starting analytics job batch...');
    
    for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
      await runAnalyticsJob('daily', new Date(d));
      console.log('Daily snapshot created for', d.toISOString().split('T')[0]);
    }
    
    console.log('All jobs completed.');
  } catch (error) {
    console.error('Job failed:', error);
  } finally {
    process.exit();
  }
})();
