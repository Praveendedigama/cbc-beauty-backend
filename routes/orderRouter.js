import express from 'express';
import { createOrder, getOrders, getOrderById, getQuote, updateOrder } from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const orderRouter = express.Router();

// Protected routes (require authentication)
orderRouter.post("/", requireAuth, createOrder)
orderRouter.get("/", requireAuth, getOrders)
orderRouter.get("/:orderId", requireAuth, getOrderById)
orderRouter.post("/quote", requireAuth, getQuote)

// Admin only routes
orderRouter.put("/:orderId", requireAdmin, updateOrder)

export default orderRouter;