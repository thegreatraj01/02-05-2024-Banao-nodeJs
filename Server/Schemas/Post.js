import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    commentText: { type: String, required: true },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: true, timestamps: true });

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    image: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);


export default Post;
