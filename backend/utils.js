// utils.js
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Generate JWT for user
export const generateToken = (user) =>
  jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

// Middleware: check if logged in
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7); // Remove "Bearer "
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// Middleware: check if admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

// Helper: return base URL (optional, use in emails)
export const baseUrl = () => process.env.BASE_URL;

// Nodemailer transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// If you want to review the commented teaching version of the utils.js setup, check commit lesson-05.
