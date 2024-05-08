import express from 'express';
import { addComment, createPost, toggleLikePost } from '../controller/PostController.js';
import { upload } from '../Middleware/Multer.middleware.js';

const router = express.Router();


router.post('/create-post',upload.single('image'),createPost);
router.put('/like-unlike',toggleLikePost);
router.put('/add-comment', addComment);


export default router;