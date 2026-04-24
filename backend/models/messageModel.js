// backend/models/messageModel.js
// -------------------------------------------------------------
// This model defines how "Contact Form" messages are stored in MongoDB.
// Each message includes the user's name, email, subject, and message body.
// Mongoose provides structure and validation for these fields.
// -------------------------------------------------------------

import mongoose from 'mongoose'; // Mongoose helps manage MongoDB documents with schema-based modeling

// -------------------------------------------------------------
// Define the schema (the structure or blueprint of a MongoDB document).
// Each key represents a field stored in the "messages" collection.
// -------------------------------------------------------------
const messageSchema = new mongoose.Schema(
  {
    // Optional field for tracking updates or last modified time.
    // Not required since timestamps are already added automatically below.
    update_time: { type: String },

    // Full name of the sender — required field.
    fullName: { type: String, required: true },

    // Sender’s email — required for contact or follow-up.
    email: { type: String, required: true },

    // Subject of the message or project inquiry — required.
    subject: { type: String, required: true },

    // Main content of the message — required.
    message: { type: String, required: true },
  },
  {
    // -------------------------------------------------------------
    // Mongoose "timestamps" option:
    // Automatically adds "createdAt" and "updatedAt" fields to each document.
    // These fields are extremely helpful for sorting or displaying message dates.
    // -------------------------------------------------------------
    timestamps: true,
  }
);

// -------------------------------------------------------------
// Create the Mongoose model.
// The first argument ("Message") is the singular name of the collection.
// Mongoose will automatically create a "messages" collection in MongoDB.
// -------------------------------------------------------------
const Message = mongoose.model('Message', messageSchema);

// -------------------------------------------------------------
// Export the model so it can be imported and used in routes and controllers.
// -------------------------------------------------------------
export default Message;
