import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { StoreProvider } from './Store.jsx';

// admin pages
import AdminRoute from './components/AdminRoute.jsx'; // lesson 5
import Messages from './pages/Messages.jsx'; // lesson 6

// pages
import Home from './pages/Home.jsx'; // lesson 3
import About from './pages/About.jsx'; // lesson 3
import Design from './pages/Design.jsx'; // lesson 3
import Portfolio from './pages/Portfolio.jsx'; // lesson 3 <- rename file if needed
import Contact from './pages/Contact.jsx'; // lesson 4
import Signin from './pages/forms/Signin.jsx'; // lesson 6
import Signup from './pages/forms/Signup.jsx'; // lesson 6
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, // renders for unknown routes under this branch
    children: [
      { index: true, element: <Home /> }, // lesson 3
      { path: 'about', element: <About /> }, // lesson 3
      { path: 'design', element: <Design /> }, // lesson 3
      { path: 'portfolio', element: <Portfolio /> }, // lesson 3 <- rename file if needed
      { path: 'contact', element: <Contact /> }, // lesson 4
      { path: 'signin', element: <Signin /> }, // lesson 6
      { path: 'signup', element: <Signup /> }, // lesson 6
      // admin route
      {
        path: 'admin/messages', // lesson 6
        element: (
          <AdminRoute>
            <Messages />
          </AdminRoute>
        ),
      },
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

// If you want to review the commented teaching version of the main.jsx setup, check commit lesson-04.
// lesson 3 added Home, About, Design, Portfolio
// lesson 4 added contact
// lesson 6 added Signin, Signup, Messages
