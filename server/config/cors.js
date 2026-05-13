/**
 * CORS Configuration for MERN Stack
 */

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    // Allow localhost
    if (origin.includes("localhost")) {
      return callback(null, true);
    }

    // Allow all Vercel deployments
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    console.warn(`🚫 CORS blocked origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

module.exports = corsOptions;