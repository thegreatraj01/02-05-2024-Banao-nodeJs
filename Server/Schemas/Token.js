import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }

}, { timestamps: true });

// Custom method to check if the token is expired
tokenSchema.methods.isTokenExpired = function () {
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    const currentTime = new Date().getTime();
    const tokenCreationTime = this.createdAt.getTime();
    return (currentTime - tokenCreationTime) > expirationTime;
};

const Token = mongoose.model('Token', tokenSchema);

export default Token;
