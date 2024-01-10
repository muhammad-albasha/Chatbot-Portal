import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import storiesRouter from './routes/stories.js';
import usersRouter from './routes/users.js';
import chatbotRouter from './routes/chatbot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRouter);
app.use('/api/users', usersRouter);
app.use('/api/chatbot', chatbotRouter);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
