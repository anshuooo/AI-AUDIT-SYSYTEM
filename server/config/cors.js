/**
 * CORS Configuration for MERN Stack
 * Handles cross-origin requests between Vercel frontend and Render backend
 */

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://localhost:5173', // Vite default
      'http://localhost:5000',
      // Production - replace with your actual Vercel app URL
      process.env.FRONTEND_URL,
      // Add more production URLs as needed
      'https://your-app-name.vercel.app'
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

module.exports = corsOptions;