import express from 'express';
import dotenv from 'dotenv';
import connect from './Db/Mobgodb.connection.js'; // Assuming this file handles MongoDB connection
import userRouter from './Routes/User.js'; // Assuming this file contains user-related routes
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());

// Middleware
app.use(express.json());
app.use("/api/v1", userRouter);




app.get('/', (req, res) => {
    res.send('Welcome');
});




// Start the server
app.listen(PORT, async () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});

