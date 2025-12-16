// backend/routes/userRoutes.js
// -------------------------------------------------------------
// This file defines all routes for user management:
// - Signup, Signin, Profile Update
// - Admin user management (CRUD)
// - Password reset via email (forget/reset password)
// -------------------------------------------------------------

import express from 'express';
import bcrypt from 'bcryptjs'; // Used for password hashing
import jwt from 'jsonwebtoken'; // Used for creating and verifying JWT tokens
import expressAsyncHandler from 'express-async-handler'; // Simplifies async error handling
import User from '../models/userModel.js'; // Mongoose User model

import {
  isAuth, // Middleware: verifies JWT for protected routes
  isAdmin, // Middleware: checks if user has admin privileges
  generateToken, // Utility: creates JWT for new or signed-in users
  baseUrl, // Utility: constructs backend or frontend base URL
  transporter, // Configured Nodemailer transporter for sending emails
} from '../utils.js';

const userRouter = express.Router();
const PAGE_SIZE = 12; // Default pagination limit per page

// -------------------------------------------------------------
// ROUTE: GET /api/users/admin
// DESCRIPTION: Admin-only route for paginated list of all users
// MIDDLEWARES: isAuth, isAdmin
// -------------------------------------------------------------
userRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || String(PAGE_SIZE), 10);

    // Run both queries concurrently for efficiency
    const [users, countUsers] = await Promise.all([
      User.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      User.countDocuments(),
    ]);

    res.json({
      users,
      totalUsers: countUsers,
      page,
      pages: Math.ceil(countUsers / pageSize),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: PUT /api/users/profile
// DESCRIPTION: Allows authenticated users to update their own profile
// ACCESS: Private (requires JWT via isAuth)
// -------------------------------------------------------------
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // req.user._id comes from JWT payload decoded in isAuth middleware
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    // Update name and email if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a new password is provided, hash it before saving
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();

    // Send updated user info + new token (refresh session)
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: DELETE /api/users/:id
// DESCRIPTION: Admin deletes a user by ID
// ACCESS: Private/Admin
// -------------------------------------------------------------
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User Not Found' });

    // Prevent deleting the root admin account
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can Not Delete Admin User' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.send({ message: 'User Deleted' });
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/users
// DESCRIPTION: Admin-only route to fetch all users
// ACCESS: Private/Admin
// -------------------------------------------------------------
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (_req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/users/:id
// DESCRIPTION: Admin fetches specific user by ID
// ACCESS: Private/Admin
// -------------------------------------------------------------
userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.send(user);
    else res.status(404).send({ message: 'User Not Found' });
  })
);

// -------------------------------------------------------------
// ROUTE: PUT /api/users/:id
// DESCRIPTION: Admin updates user details
// ACCESS: Private/Admin
// -------------------------------------------------------------
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User Not Found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.send({ message: 'User Updated', user: updatedUser });
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/users/signin
// DESCRIPTION: Authenticates user credentials and returns JWT token
// ACCESS: Public
// -------------------------------------------------------------
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    // Compare entered password with hashed password in DB
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user), // JWT token for session
      });
    }

    // Invalid login credentials
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/users/signup
// DESCRIPTION: Registers a new user with password validation
// ACCESS: Public
// -------------------------------------------------------------
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Enforce password complexity: 8+ chars, uppercase, lowercase, digit, special char
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    // Hash password before saving to DB
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Return user info + token
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/users/forget-password
// DESCRIPTION: Sends a password reset link to the user's email
// ACCESS: Public
// -------------------------------------------------------------
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: 'Email Not Found' });

    // Generate JWT valid for 10 minutes
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    // Store token temporarily in DB (requires `resetToken` field on user schema)
    user.resetToken = token;
    await user.save();

    // Build password reset URL
    const url = `${baseUrl()}/reset-password/${token}`;
    console.log('Password reset URL:', url);

    // Email content for reset link
    const emailContent = {
      from: 'profile.com',
      to: `${user.name} <${user.email}>`,
      subject: 'Reset Password',
      html: `
        <p>Please click the following link to reset your password (expires in 10 minutes):</p>
        <a href="${url}">Reset Password</a>
      `,
    };

    try {
      // Send the email using Nodemailer
      await transporter.sendMail(emailContent);
      res.send({ message: 'We sent reset password link to your email.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Error sending email.' });
    }
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/users/reset-password
// DESCRIPTION: Verifies the token and sets a new password
// ACCESS: Public (token-based)
// -------------------------------------------------------------
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    // Validate password complexity again before updating
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    // Verify the reset token
    jwt.verify(token, process.env.JWT_SECRET, async (err) => {
      if (err) return res.status(401).send({ message: 'Invalid Token' });

      // Find user associated with this token
      const user = await User.findOne({ resetToken: token });
      if (!user) return res.status(404).send({ message: 'User not found' });

      // Hash and update new password
      user.password = bcrypt.hashSync(password, 8);
      user.resetToken = undefined; // clear used token
      await user.save();

      res.send({ message: 'Password reset successfully' });
    });
  })
);

// -------------------------------------------------------------
// Export router to be mounted in server.js
// -------------------------------------------------------------
export default userRouter;
