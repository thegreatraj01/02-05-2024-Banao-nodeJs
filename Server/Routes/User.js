import express from 'express';
import { registerUser, loginUser, sendResetpasswordtoken, resetpassword } from '../controller/User.js';
import { upload } from '../Middleware/Multer.middleware.js';



const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-passwordlink', sendResetpasswordtoken);
router.post('/reset-password', resetpassword);

// router.put('/updateprofile', upload.single('profilePic'), updateProfile);
// router.get('/verifyemail', verifyemail);
// router.post('/resendemail', reSendEmail);


export default router;
