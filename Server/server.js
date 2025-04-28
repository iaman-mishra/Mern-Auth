import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cookieParser());
app.use(cors({credentials:true}));

app.use('/api/auth',authRouter);
app.get("/", (req,res)=>{
    res.send("Welcome to the MERN Auth Server")
});

app.listen(PORT, ()=>{
    console.log("Server is running on port:" + PORT);
});
