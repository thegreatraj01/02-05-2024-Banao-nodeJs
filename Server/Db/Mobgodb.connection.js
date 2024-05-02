import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL
const MONGODB_URI = process.env.DB_URL || "mongodb://localhost:27017/Banao-nodejs-1-group";

// Connect to MongoDB
const connect = () => {
    mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
};

export default connect;
