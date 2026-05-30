const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); 

console.log('Checking DATABASE_URL:', process.env.DATABASE_URL ? "FOUND" : "UNDEFINED");

const { prisma } = require('./src/db/prisma.js'); 

(async () => {
  try {
    console.log('Starting cleanup...');
    const deleted = await prisma.analyticsLog.deleteMany();
    console.log(`Successfully deleted ${deleted.count} logs.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
})();