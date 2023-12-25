// server.js
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import connectMongoDB from './utils/mongo.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB().catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});

app.use(cors());
app.use(json());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
