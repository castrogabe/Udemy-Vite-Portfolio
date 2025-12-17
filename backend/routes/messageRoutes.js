// routes/messageRoutes.js
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import { isAuth, isAdmin, transporter } from '../utils.js';

const messageRouter = express.Router();
const PAGE_SIZE = 12;

/**
 * GET /api/messages/admin
 * Paginated admin list
 */
messageRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || String(PAGE_SIZE), 10);

    const [messages, countMessages] = await Promise.all([
      Message.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      Message.countDocuments(),
    ]);

    res.json({
      messages,
      totalMessages: countMessages,
      page,
      pages: Math.ceil(countMessages / pageSize),
    });
  })
);

/**
 * POST /api/messages/contact
 * Save a contact form submission
 */
messageRouter.post(
  '/contact',
  expressAsyncHandler(async (req, res) => {
    const { update_time, fullName, email, subject, message } = req.body;

    const newMessage = new Message({
      update_time,
      fullName,
      email,
      subject,
      message,
      // If you want to persist reply fields, add them to the schema first.
    });

    const saved = await newMessage.save();
    res.status(201).json(saved);
  })
);

/**
 * GET /api/messages
 * List all messages (non-admin use carefully)
 */
messageRouter.get(
  '/',
  expressAsyncHandler(async (_req, res) => {
    const found = await Message.find();
    res.json(found);
  })
);

/**
 * DELETE /api/messages/:id
 * Admin delete
 */
messageRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: 'Message Not Found' });

    await Message.deleteOne({ _id: id });
    res.json({ message: 'Message deleted successfully' });
  })
);

/**
 * POST /api/messages/reply
 * Send a reply email
 */
messageRouter.post(
  '/reply',
  expressAsyncHandler(async (req, res) => {
    const { email, subject, replyContent } = req.body;

    const emailContent = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Re: ${subject}`,
      html: `
        <h1>Reply to Your Message</h1>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message Reply:</strong> ${replyContent}</p>
        <p>Thank you,</p>
        <p>profile.com</p>
      `,
    };

    const info = await transporter.sendMail(emailContent);
    // info.response available depending on transporter
    res.json({ message: 'Reply sent successfully' });
  })
);

export default messageRouter;

// If you want to review the commented teaching version of the seed messageRoutes.js setup, check commit lesson-06.
