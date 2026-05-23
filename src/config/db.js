const mongoose = require('mongoose');
const { DB_URI } = require('./env');

const connectDB = async () => {
  const conn = await mongoose.connect(DB_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
