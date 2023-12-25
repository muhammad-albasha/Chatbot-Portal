import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Username:", username);
  try {
    const user = await User.findOne({ $or: [{ username }, { email: username }] })
    if (!user) return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen' });

    if(user) {console.log("User:", user);}

    const isMatch = user.validatePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen' });
    const token = jwt.sign({ userId: user._id.toString(), role: user.role, iat: Date.now(), exp: Date.now() + 3600000}, process.env.JWT_SECRET);
    res.json({ success: true, token });
    console.log("Token:", token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

export default router;
