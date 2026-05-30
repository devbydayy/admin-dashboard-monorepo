require('dotenv/config');
const { prisma } = require('./src/db/prisma.js');

(async () => {
  const last = await prisma.analyticsLog.findFirst({
    where: { period: 'daily' },
    orderBy: { createdAt: 'desc' },
  });

  console.log(last);
  await prisma.$disconnect();
})();
