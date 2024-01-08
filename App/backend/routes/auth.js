import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+pwd');
    if (!user) {
      return res.status(401).json({ message: 'Email oder Passwort ist falsch' });
    }

    const isMatch = await bcrypt.compare(password, user.pwd);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email oder Passwort ist falsch' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;
