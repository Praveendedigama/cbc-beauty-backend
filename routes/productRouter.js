import express from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, searchProducts, updateProduct } from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

const productRouter = express.Router();

// Public routes
productRouter.get("/", getProducts)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/:productId", getProductById)

// Admin only routes
productRouter.post("/", requireAdmin, createProduct)
productRouter.delete("/:productId", requireAdmin, deleteProduct)
productRouter.put("/:productId", requireAdmin, updateProduct)


export default productRouter; 