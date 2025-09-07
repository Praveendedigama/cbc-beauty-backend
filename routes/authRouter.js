import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authRouter = express.Router();

// Google OAuth Routes
authRouter.get('/google', 
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

authRouter.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            // Generate JWT token for the authenticated user
            const token = jwt.sign({
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                isBlocked: req.user.isBlocked,
                type: req.user.type,
                profilePicture: req.user.profilePicture
            }, process.env.SECRET, { expiresIn: '24h' });

            // Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                type: req.user.type,
                profilePicture: req.user.profilePicture,
                email: req.user.email
            }))}`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
        }
    }
);

export default authRouter;
