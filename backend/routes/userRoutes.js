import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  transporter,
} from '../utils.js';

const userRouter = express.Router();
const PAGE_SIZE = 12; // 12 items per page

// Admin route to get paginated list of users
userRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || String(PAGE_SIZE), 10);

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

// User profile update
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  })
);

// Delete user by ID (admin)
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User Not Found' });

    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can Not Delete Admin User' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.send({ message: 'User Deleted' });
  })
);

// Get all users (admin)
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (_req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

// Get user by ID (admin)
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

// Update user by ID (admin)
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

// User sign-in
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).send({ message: 'Invalid email or password' });

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// User sign-up
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();
    const password = String(req.body.password || '');

    // Password complexity (8+ chars, upper, lower, digit, special)
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// Forgot password (send reset link)
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: 'Email Not Found' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    user.resetToken = token; // make sure model has this field (see notes)
    await user.save();

    const url = `${baseUrl()}/reset-password/${token}`;
    console.log('Password reset URL:', url);

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
      await transporter.sendMail(emailContent);
      res.send({ message: 'We sent reset password link to your email.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Error sending email.' });
    }
  })
);

// Reset password (verify token and set new password)
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { password, token } = req.body;

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send({ message: 'Password does not meet complexity requirements.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err) => {
      if (err) return res.status(401).send({ message: 'Invalid Token' });

      const user = await User.findOne({ resetToken: token });
      if (!user) return res.status(404).send({ message: 'User not found' });

      user.password = bcrypt.hashSync(password, 8);
      user.resetToken = undefined; // clear used token
      await user.save();

      res.send({ message: 'Password reset successfully' });
    });
  })
);

export default userRouter;

// If you want to review the commented teaching version of the userRoutes.js setup, check commit lesson-05.
