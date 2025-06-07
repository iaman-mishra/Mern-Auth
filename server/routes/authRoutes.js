import express from 'express';
import { isAuthenticated, login, logout, register, sendVerifyOtp ,veifyEmail} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, veifyEmail);
authRouter.post('/is-auth',userAuth, isAuthenticated);

export default authRouter;