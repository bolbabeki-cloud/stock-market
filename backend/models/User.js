const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  preferredCurrency: { type: String, default: 'INR — Indian Rupee' },
  bio: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
