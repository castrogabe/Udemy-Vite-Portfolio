// models/messageModel.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    update_time: { type: String }, // optional
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

// If you want to review the commented teaching version of the messageModel.js setup, check commit lesson-05.
