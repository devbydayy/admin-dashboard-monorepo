const allowedOrigins = [
  "http://localhost:3000",
  "https://admin-dashboard-monorepo-front.vercel.app",
];

module.exports = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
};
