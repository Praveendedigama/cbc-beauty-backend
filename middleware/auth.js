import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// JWT Middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user = decoded;
        } catch (error) {
            console.log("Invalid token:", error.message);
            req.user = null;
        }
    } else {
        console.log("No token provided");
        req.user = null;
    }

    next();
};

// Route protection middleware
export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    next();
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    if (req.user.type !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
};

export const requireCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    if (req.user.type !== "customer") {
        return res.status(403).json({ message: "Access denied. Customer privileges required." });
    }
    next();
};
