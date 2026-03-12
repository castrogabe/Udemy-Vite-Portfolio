import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Design from './pages/Design.jsx';
import Portfolio from './pages/Portfolio.jsx'; // <- rename file if needed
import NotFound from './pages/NotFound.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />, // renders for unknown routes under this branch
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'design', element: <Design /> },
      { path: 'portfolio', element: <Portfolio /> },
      // optional explicit catch-all (not required if you keep errorElement)
      { path: '*', element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
