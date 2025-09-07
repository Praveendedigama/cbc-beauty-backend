import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import dotenv from "dotenv";
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import cors from "cors";
import { authenticateToken } from './middleware/auth.js';
dotenv.config()

const app = express();

const mongoUrl = process.env.MONGO_DB_URI

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://cbc-beauty.vercel.app',
    'https://crystal-beauty.vercel.app',
    'https://cbc-beauty-frontend.vercel.app'
  ],
  credentials: true
}))

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

app.listen(
  5000,
  () => {
    console.log('Server is running on port 5000');
  }
)