import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { StoreProvider } from './Store.jsx';

// user protected pages
import ProtectedRoute from './components/ProtectedRoute.jsx'; // lesson 7

// admin pages
import AdminRoute from './components/AdminRoute.jsx'; // lesson 5
import Dashboard from './pages/Dashboard.jsx'; // lesson 7
import Messages from './pages/Messages.jsx'; // lesson 6
import UserList from './pages/admin/UserList.jsx'; // lesson 8
import UserEdit from './pages/admin/UserEdit.jsx'; // lesson 8

// pages
import Home from './pages/Home.jsx'; // lesson 3
import About from './pages/About.jsx'; // lesson 3
import Design from './pages/Design.jsx'; // lesson 4
import Portfolio from './pages/Portfolio.jsx'; // lesson 3
import Contact from './pages/Contact.jsx'; // lesson 5
import NotFound from './pages/NotFound.jsx';

// forms
import Signin from './pages/forms/Signin.jsx'; // lesson 6
import Signup from './pages/forms/Signup.jsx'; // lesson 6
import Profile from './pages/forms/Profile.jsx'; // lesson 7
import ForgetPassword from './pages/forms/ForgetPassword.jsx'; // lesson 7
import ResetPassword from './pages/forms/ResetPassword.jsx'; // lesson 7

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, // renders for unknown routes under this branch
    children: [
      { index: true, element: <Home /> }, // lesson 3
      { path: 'about', element: <About /> }, // lesson 3
      { path: 'design', element: <Design /> }, // lesson 4
      { path: 'portfolio', element: <Portfolio /> }, // lesson 3
      { path: 'contact', element: <Contact /> }, // lesson 5
      { path: 'signin', element: <Signin /> }, // lesson 6
      { path: 'signup', element: <Signup /> }, // lesson 6
      { path: 'forgot-password', element: <ForgetPassword /> }, // lesson 7

      // Protected Route
      { path: 'reset-password/:token', element: <ResetPassword /> }, // lesson 7
      {
        path: 'profile', // lesson 7
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // admin route
      {
        path: 'admin/messages', // lesson 6
        element: (
          <AdminRoute>
            <Messages />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/dashboard', // lesson 7
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users', // lesson 8
        element: (
          <AdminRoute>
            <UserList />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users/:id', // lesson 8
        element: (
          <AdminRoute>
            <UserEdit />
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

// If you want to review the commented teaching version of the main.jsx setup, check commit lesson-03.
// lesson 3 added Home, About, Portfolio
// lesson 4 added Contact, Design
// lesson 6 added Signin, Signup, Messages
// lesson 7 added Dashboard, Profile, ResetPassword, ForgetPassword
// lesson 8 added UserList, UserEdit
