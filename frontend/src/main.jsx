import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Design from './pages/Design.jsx';
import Portfolio from './pages/Portfolio.jsx'; // <- rename file if needed
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { StoreProvider } from './Store.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, // renders for unknown routes under this branch
    children: [
      { index: true, element: <Home /> }, // lesson 3
      { path: 'about', element: <About /> }, // lesson 3
      { path: 'design', element: <Design /> }, // lesson 3
      { path: 'portfolio', element: <Portfolio /> }, // lesson 3
      { path: 'contact', element: <Contact /> }, // lesson 4
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to review the commented teaching version of the main setup, check commit lesson-04.
// lesson 3 added Home, About, Design, Portfolio
// lesson 4 added Contact
