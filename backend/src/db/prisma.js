const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prismaOptions = {
  adapter,
  log: [
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
  ],
};

if (process.env.NODE_ENV === "development") {
  prismaOptions.log.push(
    { level: "query", emit: "stdout" },
    { level: "info", emit: "stdout" }
  );
}

const prisma = new PrismaClient(prismaOptions);

prisma.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

module.exports = { prisma };