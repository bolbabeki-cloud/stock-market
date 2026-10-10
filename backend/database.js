const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const getMongoUri = () => process.env.MONGODB_URI || (process.env.FUNCTION_TARGET ? '' : 'mongodb://127.0.0.1:27017/stockportfolio');
let connectionPromise;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return true;
  const mongoUri = getMongoUri();
  if (!mongoUri) {
    if (!process.env._MONGODB_WARNING_SHOWN) {
      process.env._MONGODB_WARNING_SHOWN = 'true';
      console.warn('MONGODB_URI is not configured; database-backed auth is unavailable');
    }
    return false;
  }
  if (!connectionPromise) connectionPromise = (async () => {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      const demoUser = await User.findOne({ email: 'demo@stockportfolio.com' });
      if (!demoUser) {
        await User.create({
          email: 'demo@stockportfolio.com',
          passwordHash: await bcrypt.hash('demo123', 12),
          name: 'Demo User',
          country: 'India',
        });
      }
      console.log('MongoDB connected');
      return true;
    } catch (error) {
      connectionPromise = undefined;
      console.warn(`MongoDB unavailable: ${error.message}`);
      return false;
    }
  })();
  return connectionPromise;
};

const getDatabaseStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
});

module.exports = { connectDatabase, getDatabaseStatus };
