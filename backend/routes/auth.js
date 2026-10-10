const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

const publicUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  country: user.country,
  phone: user.phone,
  preferredCurrency: user.preferredCurrency,
  bio: user.bio,
  createdAt: user.createdAt,
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, country } = req.body;
    if (!email || !password || !name || !country) {
      return res.status(400).json({ error: 'Email, password, name, and country are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });

    const user = await User.create({
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      name,
      country,
    });
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to log in' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['name', 'email', 'country', 'phone', 'preferredCurrency', 'bio'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key)));
    if (updates.email) updates.email = updates.email.trim().toLowerCase();
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to update profile' });
  }
});

module.exports = router;
