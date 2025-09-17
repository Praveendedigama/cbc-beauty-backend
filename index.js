import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import dotenv from "dotenv";
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import authRouter from './routes/authRouter.js';
import cors from "cors";
import { authenticateToken } from './middleware/auth.js';
import passport from './config/passport.js';
import session from 'express-session';
dotenv.config()

const app = express();

const mongoUrl = process.env.MONGO_DB_URI

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://cbc-beauty.vercel.app',
    'https://crystal-beauty.vercel.app',
    'https://cbc-beauty-frontend-2n39e380g.vercel.app',
    'https://cbc-beauty-frontend-2n39e380g.vercel.app'
  ],
  credentials: true
}))

// Session configuration for OAuth
app.use(session({
  secret: process.env.SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongoUrl, {})
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database connected");
})

app.use(bodyParser.json())

// JWT Middleware
app.use(authenticateToken)

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(`Server is running on port ${PORT}`);
  }
)