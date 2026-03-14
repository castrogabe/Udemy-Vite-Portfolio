// src/main.jsx (or index.jsx)
// -------------------------------------------------------------
// This is the entry point of the React application.
// It sets up the router, loads global providers, imports CSS,
// and mounts the app to the HTML root element.
// -------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; // For SEO titles/meta tags
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // React Router v6
import App from './App.jsx'; // Root layout component
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Design from './pages/Design.jsx';
import Portfolio from './pages/Portfolio.jsx'; // Dynamic list of websites
import NotFound from './pages/NotFound.jsx'; // 404 page for invalid routes

// -------------------------------------------------------------
// Import global styles and Bootstrap
// - Bootstrap CSS and JS for layout and components
// - index.css for your custom styles
// -------------------------------------------------------------
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

// -------------------------------------------------------------
// React Router Configuration
// -------------------------------------------------------------
// createBrowserRouter defines route objects for the app.
// Nested routes are rendered inside <Outlet /> in App.jsx.
// -------------------------------------------------------------
const router = createBrowserRouter([
  {
    path: '/', // Base route
    element: <App />, // Shared layout component
    errorElement: <NotFound />, // Displayed for unknown paths under this branch
    children: [
      { index: true, element: <Home /> }, // Renders at "/"
      { path: 'about', element: <About /> }, // Renders at "/about"
      { path: 'design', element: <Design /> }, // Renders at "/design"
      { path: 'portfolio', element: <Portfolio /> }, // Renders at "/portfolio"
      // You can easily add new pages here later
    ],
  },
]);

// -------------------------------------------------------------
// React 18 Root Rendering
// -------------------------------------------------------------
// - ReactDOM.createRoot() replaces ReactDOM.render() (React 17).
// - <React.StrictMode> helps highlight potential issues in development.
// - <HelmetProvider> allows Helmet components to manage <head> tags safely.
// - <RouterProvider> applies our route configuration to the app.
// -------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
