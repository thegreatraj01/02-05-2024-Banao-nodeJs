import Post from "../Schemas/post.js";
import uploadToCloudinary from "../Utils/Cloudinary.js";

const createPost = async (req, res) => {
    try {
        const imagePath = req.file.path;
        const { content, postedBy, } = req.body;

        const image = await uploadToCloudinary(imagePath);

        if (!content || !postedBy) {
            return res.status(400).json({ message: 'Content and postedBy fields are required' });
        }

        const newPost = new Post({
            content,
            image: image || "",
            postedBy
        });

        await newPost.save();
        // Respond with success message

        return res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const toggleLikePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        if (!postId || !userId) {
            return res.status(400).json({ message: 'postId and userId fields are required' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (!post.likes.includes(userId)) {
            // User has not liked the post, so like it
            await post.updateOne({ $push: { likes: userId } });
            return res.status(200).json("Post has been liked");
        } else {
            // User has liked the post, so unlike it
            await post.updateOne({ $pull: { likes: userId } });
            return res.status(200).json("Post has been unliked");
        }
    } catch (error) {
        console.error('Error toggling like on post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const addComment = async (req, res) => {
    try {
        const { postId, userId, commentText } = req.body;

        if (!postId || !userId || !commentText) {
            return res.status(400).json({ message: 'postId, userId and commentText fields are required' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            commentText,
            commentedBy: userId
        };

        post.comments.push(newComment);

        await post.save();

        return res.status(200).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



export { createPost, toggleLikePost, addComment };


