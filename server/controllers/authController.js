import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
    const {name , email, password} = req.body;
    if(!name || !email || !password) {
        return res.json({success:false, message: "All fields are required"});
    }
    try {
        
        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.json({success:false, message: "User already exists"});
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })
        await user.save();

        // Generate JWT token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nThe Team`
        }

        await transporter.sendMail(mailOptions);

        res.json({success:true, message: "User registered successfully"});

    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

export const login = async (req,res) =>{
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({success:false, message: "Credentials are required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success:false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.json({success:false, message: "Invalid credentials"});
        }

        // Generate JWT token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({success:true, message: "Login successful"});
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

export const logout = async (req , res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict'   
        })
        return res.json({success:true, message: "Logout successful"});
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}


export const sendVerifyOtp = async (req, res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isVerified) {
            return res.json({success:false, message: "User already verified"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        user.verifyOtp = otp;
        user.verifyOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Account',
            text: `Your verification code is ${otp}. It is valid for 10 minutes.`
        }

        await transporter.sendMail(mailOptions);
        return res.json({success:true, message: "OTP sent to your email"});

    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

export const veifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp) {
        return res.json({success:false, message: "OTP is required"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success:false, message: "User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false, message: "Invalid OTP"});
        }

        if(user.verifyOtpExpires < Date.now()) {
            return res.json({success:false, message: "OTP expired"});
        }

        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpires = 0;
        await user.save();
        return res.json({success:true, message: "Email verified successfully"});
        
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

// This function checks if the user is authenticated
export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

export const sendResetOtp = async (req, res)=>{
    const {email} = req.body;
    if(!email) {
        return res.json({success:false, message: "Email is required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success:false, message: "User not found"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        user.resetOtp = otp;
        user.resetOtpExpireAt= Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Your Password',
            text: `Your password reset code is ${otp}. It is valid for 10 minutes.`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true, message: "OTP sent to your email"});
    } catch (error) {
        return res.json({success:false, message: error.message});
    }

}