import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Profile:', profile);
        
        // Check if user already exists
        let existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // User exists, update Google ID if not set
            if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                await existingUser.save();
            }
            return done(null, existingUser);
        }
        
        // Create new user
        const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicture: profile.photos[0]?.value || 'https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg',
            type: 'customer', // Default to customer
            isBlocked: false,
            password: 'google-oauth-user' // Placeholder password
        });
        
        await newUser.save();
        console.log('New Google user created:', newUser.email);
        return done(null, newUser);
        
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
