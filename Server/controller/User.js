import User from '../Schemas/User.js';
import sendEmail from '../Utils/SendEmail.js';
import { generateToken, verifyToken, generatePasswordResetToken } from '../Utils/GenrateToken.js';
import Token from '../Schemas/Token.js';

const registerUser = async (req, res) => {
    try {
        // Extract user data from request body
        const { username, password, email } = req.body;

        // Check if required fields are empty
        if (!username || !password || !email) {
            throw new Error('All required fields must be filled');
        }

        // Check if user with the provided email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingUser2 = await User.findOne({ username: username });
        if (existingUser2) {
            return res.status(400).json({ message: 'Username already taken try something else ' });
        }


        // Password validation regex pattern
        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{6,}$/;
        if (!passwordPattern.test(password)) {
            throw new Error('Password must contain at least one number, one uppercase letter, and one special character');
        }

        // Create a new user instance using the User model
        const newUser = new User({
            username,
            password,
            email,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id);
        savedUser.password = null;

        // Return success response
        res.status(201).json({ message: 'User registered successfully', user: savedUser, token });
    } catch (error) {
        // Handle errors
        console.error('Error registering user:', error);
        res.status(400).json({ message: error.message || 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        // Extract user data from request body
        const { password, email } = req.body;

        // Check if required fields are empty
        if (!password || !email) {
            throw new Error('All required fields must be filled');
        }

        // Check if user with the provided email exists
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: 'No user found with provided email' });
        }

        // Verify the password
        const isPasswordValid = await existingUser.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const loginUser = {
            email: existingUser.email,
            id: existingUser._id,
        }
        // Password is valid, generate token
        const token = generateToken(existingUser._id);

        // Return success response with user details and token
        res.status(200).json({ message: 'Login successful', user: loginUser, token });
    } catch (error) {
        // Handle errors
        console.error('Error logging in user:', error);
        res.status(400).json({ message: error.message || 'Internal server error' });
    }
};

const sendResetpasswordtoken = async (req, res) => {
    try {
        const email = req.body.email;

        // Check if user with the provided email exists
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: 'No user found' });
        }

        // Delete existing password reset tokens for the user
        await Token.deleteMany({ userId: existingUser._id });

        // Generate a password reset token
        const tokenValue = generatePasswordResetToken();

        // Create an instance of the Token model and save it to the database
        const token = new Token({
            userId: existingUser._id,
            token: tokenValue
        });
        await token.save();

        // Send the password reset link via email
        sendEmail(existingUser.email, tokenValue);

        // Return success response
        res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

const resetpassword = async (req, res) => {
    try {
        const { usertoken, newpassword, userid } = req.body;
        
        // Find the user by ID
        const existingUser = await User.findById(userid);
        if (!existingUser) {
            return res.status(404).json({ message: 'No user found' });
        }
       
        // Find the token in the database
        const databaseToken = await Token.findOne({ userId: userid });
        if (!databaseToken) {
            return res.status(404).json({ message: 'Token not found in the database' });
        }

        // Compare user-provided token with database token
        if (usertoken !== databaseToken.token) {
            return res.status(404).json({ message: 'Token is not valid' });
        }

        // Check if the token is expired
        const isTokenExpired = databaseToken.isTokenExpired();
        if (isTokenExpired) {
            return res.status(404).json({ message: 'Token has expired' });
        }

        const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{6,}$/;
        if (!passwordPattern.test(newpassword)) {
            throw new Error('Password must contain at least one number, one uppercase letter, and one special character');
        }
        // Reset the user's password
        existingUser.password = newpassword;
        await existingUser.save();

        // Return success response
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}


export { registerUser, loginUser, sendResetpasswordtoken, resetpassword };
