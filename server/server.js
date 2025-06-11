import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173' , 'https://mern-auth-one-gamma.vercel.app']
app.use(cors({origin: allowedOrigins, credentials:true}));

// API Routes
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})