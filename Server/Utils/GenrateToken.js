import jwt from 'jsonwebtoken';

// Function to generate JWT token with expiry time of 10 minutes
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
};

const generatePasswordResetToken = () => {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    return randomNumber;
};
// Function to verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;

    } catch (err) {
        // Token verification failed
        if (err.name === 'TokenExpiredError') {
            // Token has expired
            return null;
        }
        // Other errors (e.g., invalid token)
        console.error('Token verification error:', err.message);
        return null;
    }
};


export { generateToken, verifyToken, generatePasswordResetToken };
