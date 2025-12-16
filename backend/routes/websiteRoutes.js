// backend/routes/websiteRoutes.js
// -------------------------------------------------------------
// This file defines all CRUD routes for managing Website data.
// It connects the Website model to the Express API.
// -------------------------------------------------------------
//
// Features covered:
// ✅ Public routes for viewing websites
// ✅ Admin routes for creating, updating, and deleting websites
// ✅ Pagination for both admin and frontend use
// -------------------------------------------------------------

import express from 'express';
import Website from '../models/websiteModel.js';
import { isAuth, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

// Initialize Express Router
const websiteRouter = express.Router();

// -------------------------------------------------------------
// ROUTE: GET /api/websites
// DESCRIPTION: Fetch all websites (public access)
// -------------------------------------------------------------
websiteRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const websites = await Website.find();
    res.send(websites);
  })
);

// -------------------------------------------------------------
// ROUTE: POST /api/websites
// DESCRIPTION: Admin route to create a placeholder website
// ACCESS: Private/Admin
// -------------------------------------------------------------
websiteRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // Default template object for a new website entry
    const newWebsite = new Website({
      name: String(Date.now()), // Temporary unique name
      slug: String(Date.now()), // Temporary slug
      image: '/images/', // Placeholder image
      language: 'MERN Stack',
      languageDescription: 'MongoDB, Express, AngularJS, Node.js',
      description: 'description',
      link: 'https://www.domain.com',
    });

    const website = await newWebsite.save();
    res.send({ message: 'Website Created', website });
  })
);

// -------------------------------------------------------------
// ROUTE: PUT /api/websites/:id
// DESCRIPTION: Admin route to update a website by ID
// ACCESS: Private/Admin
// -------------------------------------------------------------
websiteRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const website = await Website.findById(req.params.id);
    if (!website) return res.status(404).send({ message: 'Website Not Found' });

    // Update website fields
    website.name = req.body.name;
    website.slug = req.body.slug;
    website.image = req.body.image;
    website.language = req.body.language;
    website.languageDescription = req.body.languageDescription;
    website.description = req.body.description;
    website.link = req.body.link;

    await website.save();
    res.send({ message: 'Website Updated' });
  })
);

// -------------------------------------------------------------
// ROUTE: DELETE /api/websites/:id
// DESCRIPTION: Admin route to delete a website by ID
// ACCESS: Private/Admin
// -------------------------------------------------------------
websiteRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const website = await Website.findById(req.params.id);
    if (!website) return res.status(404).send({ message: 'Website Not Found' });

    await website.deleteOne(); // modern replacement for .remove()
    res.send({ message: 'Website Deleted' });
  })
);

// -------------------------------------------------------------
// Pagination setup
// -------------------------------------------------------------
const PAGE_SIZE = 10;

// -------------------------------------------------------------
// ROUTE: GET /api/websites/admin
// DESCRIPTION: Paginated list for admin dashboard
// ACCESS: Private/Admin
// -------------------------------------------------------------
websiteRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || PAGE_SIZE;

    const websites = await Website.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countWebsites = await Website.countDocuments();

    res.send({
      websites,
      totalWebsites: countWebsites,
      page,
      pages: Math.ceil(countWebsites / pageSize),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/websites/search
// DESCRIPTION: Paginated search results for frontend Portfolio.jsx
// ACCESS: Public
// -------------------------------------------------------------
websiteRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || PAGE_SIZE;

    const websites = await Website.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countWebsites = await Website.countDocuments();

    res.send({
      websites,
      totalWebsites: countWebsites,
      page,
      pages: Math.ceil(countWebsites / pageSize),
    });
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/websites/slug/:slug
// DESCRIPTION: Fetch website by slug (used for SEO-friendly URLs)
// ACCESS: Public
// -------------------------------------------------------------
websiteRouter.get(
  '/slug/:slug',
  expressAsyncHandler(async (req, res) => {
    const website = await Website.findOne({ slug: req.params.slug });
    if (!website) return res.status(404).send({ message: 'Website Not Found' });
    res.send(website);
  })
);

// -------------------------------------------------------------
// ROUTE: GET /api/websites/:id
// DESCRIPTION: Fetch website by MongoDB _id
// ACCESS: Public
// -------------------------------------------------------------
websiteRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const website = await Website.findById(req.params.id);
    if (!website) return res.status(404).send({ message: 'Website Not Found' });
    res.send(website);
  })
);

// -------------------------------------------------------------
// Export router to be mounted in server.js as:
// app.use('/api/websites', websiteRouter);
// -------------------------------------------------------------
export default websiteRouter;
