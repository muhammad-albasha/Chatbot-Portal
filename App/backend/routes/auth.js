import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import cors from 'cors';
import connectMongoDB from '../utils/mongo.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.use(cors());

// Connect to MongoDB
connectMongoDB();

// Login Route
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Logging in with:", username, password);
  
      const user = await User.findOne({ $or: [{ username }, { email: username }] });
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ success: false, message: 'Benutzer nicht gefunden' });
      }
  
      if (user) {
          console.log("User found:", user);
      }
  
      const isDirectMatch = await bcrypt.compare('known-plaintext-password', user.pwd);
      console.log("Direct comparison result:", isDirectMatch);
  
      
      const isMatch = await user.validatePassword(password);
      if (!isMatch) {
        console.log("Password does not match");
        return res.status(401).json({ success: false, message: 'Falsches Passwort' });
      }
      if (isMatch) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        console.log("Password matches");
        console.log("Token:", token);
        
        // User authenticated
        res.json({ 
        success: true, 
        token: token,
        user: { 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          userId: user._id,
          has2FA: user.has2FA,
          secret: user.secret,
          id: user._id,
        } 
    });
}
    } catch (error) {
        console.error(error);
      res.status(500).json({ success: false, message: 'Serverfehler' });
    }
  });
      
export default router;