const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'CLIENT_URL'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  cookieExpire: parseInt(process.env.COOKIE_EXPIRE, 10),
  clientUrl: process.env.CLIENT_URL,
  socketPort: process.env.SOCKET_PORT || 5001
};
