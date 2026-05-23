const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URI: process.env.MONGO_URI || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};
