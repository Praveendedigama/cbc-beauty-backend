import mongoose from 'mongoose';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Find and update the specific user
    User.findOneAndUpdate(
      { email: 'mailtopraveenhansa@gmail.com' },
      { type: 'customer' },
      { new: true }
    )
    .then((updatedUser) => {
      if (updatedUser) {
        console.log('✅ User updated successfully:');
        console.log('Email:', updatedUser.email);
        console.log('Type:', updatedUser.type);
        console.log('First Name:', updatedUser.firstName);
        console.log('Last Name:', updatedUser.lastName);
      } else {
        console.log('❌ User not found');
      }
      
      // Close connection
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error updating user:', error);
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
