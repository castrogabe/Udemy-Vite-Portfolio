// backend/utils.js
// -------------------------------------------------------------
// This utility file provides helper functions and middlewares
// used throughout the backend for authentication, authorization,
// and email delivery.
// -------------------------------------------------------------

import jwt from 'jsonwebtoken'; // Used to create and verify JSON Web Tokens
import nodemailer from 'nodemailer'; // Used for sending emails (password reset, contact reply, etc.)

// -------------------------------------------------------------
// Function: generateToken()
// -------------------------------------------------------------
// Creates a signed JWT (JSON Web Token) for a logged-in user.
// The token includes basic user info and expires in 30 days.
// It’s sent to the client upon login or signup.
// -------------------------------------------------------------
export const generateToken = (user) =>
  jwt.sign(
    {
      _id: user._id, // Unique user ID from MongoDB
      name: user.name, // Name displayed in UI
      email: user.email, // Used for identity and contact
      isAdmin: user.isAdmin, // Used for role-based access control
    },
    process.env.JWT_SECRET, // Secret key for signing the token (stored in .env)
    {
      expiresIn: '30d', // Token expiration: 30 days
    }
  );

// -------------------------------------------------------------
// Middleware: isAuth
// -------------------------------------------------------------
// Checks if the request contains a valid JWT token.
// Used to protect routes that require authentication.
// If valid, attaches decoded user data to req.user.
// -------------------------------------------------------------
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    // Expected format: "Bearer <token>"
    const token = authorization.slice(7); // Removes "Bearer " prefix

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode; // Attach decoded payload to request
        next(); // Proceed to next middleware or route
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// -------------------------------------------------------------
// Middleware: isAdmin
// -------------------------------------------------------------
// Checks if the authenticated user has admin privileges.
// This middleware is used after isAuth on admin-only routes.
// -------------------------------------------------------------
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is admin → continue
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

// -------------------------------------------------------------
// Helper Function: baseUrl()
// -------------------------------------------------------------
// Returns the base URL for your app. Useful when constructing
// absolute links inside email templates (e.g., password reset URLs).
// -------------------------------------------------------------
export const baseUrl = () => process.env.BASE_URL;

// -------------------------------------------------------------
// Nodemailer Transporter
// -------------------------------------------------------------
// Creates a pre-configured email transporter for Gmail (or any provider).
// The credentials (EMAIL_USER and EMAIL_PASS) are stored in .env.
// Example usage: transporter.sendMail({ to, subject, html })
// -------------------------------------------------------------
export const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change to 'yahoo', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app-specific password (not your normal one)
  },
});
