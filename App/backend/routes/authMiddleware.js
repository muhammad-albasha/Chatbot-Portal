import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ logout: true, message: "Token fehlt" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ logout: true, message: "Token ungültig" });
  }
};


export default authMiddleware;
