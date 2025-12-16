// -------------------------------------------------------------
// AdminRoute.jsx — Protects Admin-Only Pages
// -------------------------------------------------------------
// This component ensures that only authenticated admin users
// can access certain routes (e.g. /admin/dashboard, /admin/users).
//
// Concepts covered:
// ✅ React Router route protection pattern
// ✅ Redirecting unauthenticated users to Signin
// ✅ Role-based access control (RBAC)
// ✅ Preserving redirect URL after login
// -------------------------------------------------------------

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminRoute({ children }) {
  // -----------------------------------------------------------
  // Access global state (userInfo) from Store Context
  // -----------------------------------------------------------
  const { state } = useContext(Store);
  const { userInfo } = state;

  // useLocation lets us capture the current path,
  // so if user isn’t signed in, we can send them back
  // to this page after login.
  const location = useLocation();

  // -----------------------------------------------------------
  // 1️⃣ If user is not logged in, redirect to Signin page
  // -----------------------------------------------------------
  if (!userInfo) {
    return (
      <Navigate
        to={`/signin?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  // -----------------------------------------------------------
  // 2️⃣ If user is logged in but NOT an admin, redirect home
  // -----------------------------------------------------------
  if (!userInfo.isAdmin) return <Navigate to='/' replace />;

  // -----------------------------------------------------------
  // 3️⃣ Otherwise, render the requested child component(s)
  // -----------------------------------------------------------
  return children;
}
