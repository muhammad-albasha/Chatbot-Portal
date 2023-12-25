//utils/mongo.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const connect = mongoose.connect;


const mongoConnectionString = process.env.MONGO_URI;
mongoose.connect(mongoConnectionString);

const connectMongoDB = async () => {
    try {
        await connect(mongoConnectionString);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

export default connectMongoDB;
