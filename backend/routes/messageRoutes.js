// backend/routes/messageRoutes.js
// -------------------------------------------------------------
// This file defines all API routes related to user messages.
// These include contact form submissions, admin viewing, deletion,
// and sending reply emails via Nodemailer.
// -------------------------------------------------------------

import express from 'express';
import expressAsyncHandler from 'express-async-handler'; // Simplifies error handling in async routes
import Message from '../models/messageModel.js'; // Import the Mongoose Message model
import { isAuth, isAdmin, transporter } from '../utils.js'; // Auth middlewares + email transporter

const messageRouter = express.Router(); // Create a new Express router instance
const PAGE_SIZE = 12; // Default number of messages per page (for admin pagination)

// -------------------------------------------------------------
// ROUTE: GET /api/messages/admin
// DESCRIPTION: Returns a paginated list of messages for admin dashboard
// MIDDLEWARES: isAuth (requires login), isAdmin (admin-only access)
// -------------------------------------------------------------
messageRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // Parse pagination query parameters (with default values)
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || String(PAGE_SIZE), 10);

    // Fetch paginated messages and total count simultaneously for efficiency
    const [messages, countMessages] = await Promise.all([
      Message.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      Message.countDocuments(),
    ]);

    // Respond with message data and pagination info
    res.json({
      messages,
      totalMessages: countMessages,
      page,
      pages: Math.ceil(countMessages / pageSize),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/messages/contact
// DESCRIPTION: Saves a new contact form submission to the database
// ACCESS: Public (no authentication required)
// -------------------------------------------------------------
messageRouter.post(
  '/contact',
  expressAsyncHandler(async (req, res) => {
    const { update_time, fullName, email, subject, message } = req.body;

    // Create a new Message document from form data
    const newMessage = new Message({
      update_time,
      fullName,
      email,
      subject,
      message,
      // Note: additional fields like 'reply' could be added later
    });

    // Save to MongoDB
    const saved = await newMessage.save();

    // Respond with created document
    res.status(201).json(saved);
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/messages
// DESCRIPTION: Fetch all messages (use with caution, mainly for admin tools)
// ACCESS: Public or Protected (depending on use case)
// -------------------------------------------------------------
messageRouter.get(
  '/',
  expressAsyncHandler(async (_req, res) => {
    const found = await Message.find();
    res.json(found);
  })
);

// -------------------------------------------------------------
// ROUTE: DELETE /api/messages/:id
// DESCRIPTION: Delete a specific message by ID (admin only)
// MIDDLEWARES: isAuth, isAdmin
// -------------------------------------------------------------
messageRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const msg = await Message.findById(id);

    if (!msg) {
      return res.status(404).json({ message: 'Message Not Found' });
    }

    // Delete the message document from the collection
    await Message.deleteOne({ _id: id });
    res.json({ message: 'Message deleted successfully' });
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/messages/reply
// DESCRIPTION: Sends a reply email back to the user using Nodemailer
// ACCESS: Public (you could make this admin-only if desired)
// -------------------------------------------------------------
messageRouter.post(
  '/reply',
  expressAsyncHandler(async (req, res) => {
    const { email, subject, replyContent } = req.body;

    // Define the email template and content
    const emailContent = {
      from: process.env.EMAIL_FROM, // Sender address (from .env)
      to: email, // Recipient (user who sent the original message)
      subject: `Re: ${subject}`, // Prefix with "Re:" to indicate reply
      html: `
        <h1>Reply to Your Message</h1>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message Reply:</strong> ${replyContent}</p>
        <p>Thank you,</p>
        <p>profile.com</p>
      `,
    };

    // Send the email using the Nodemailer transporter (configured in utils.js)
    const info = await transporter.sendMail(emailContent);

    // You can log info.response or info.messageId for debugging
    res.json({ message: 'Reply sent successfully' });
  })
);

// -------------------------------------------------------------
// Export router so it can be used in server.js (app.use('/api/messages', messageRouter))
// -------------------------------------------------------------
export default messageRouter;
