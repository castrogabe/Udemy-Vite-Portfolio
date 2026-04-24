// backend/models/userModel.js
// -------------------------------------------------------------
// This model defines how user accounts are stored in MongoDB.
// It’s used for authentication, authorization, and managing admin privileges.
// -------------------------------------------------------------

import mongoose from 'mongoose'; // Import Mongoose to define schema-based MongoDB models

// -------------------------------------------------------------
// Define the schema for the "User" collection.
// Each user record will contain basic login and role information.
// -------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    // User’s display name — required for identification on the site.
    name: { type: String, required: true },

    // Email serves as a unique identifier for login.
    // Setting `unique: true` ensures no duplicate email addresses are stored.
    email: { type: String, required: true, unique: true },

    // Password field stores the user’s encrypted (hashed) password.
    // Hashing is handled later (in middleware or controller before saving).
    password: { type: String, required: true },

    // Determines whether this user has administrative privileges.
    // Default value: false (regular user)
    // Required ensures every record explicitly sets this field.
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    // -------------------------------------------------------------
    // Automatically adds "createdAt" and "updatedAt" timestamps
    // for each user document. This helps track registration and updates.
    // -------------------------------------------------------------
    timestamps: true,
  }
);

// -------------------------------------------------------------
// Create the Mongoose model.
// - The first argument "User" is the singular form of the collection name.
// - MongoDB will store these in a "users" collection automatically.
// -------------------------------------------------------------
const User = mongoose.model('User', userSchema);

// -------------------------------------------------------------
// Export the model so it can be imported into authentication routes,
// controllers, and seed scripts.
// -------------------------------------------------------------
export default User;
