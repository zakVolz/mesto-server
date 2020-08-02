require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
  PORT: 3000,
  DATA_URL: 'mongodb://localhost:27017/mestodb',
};
