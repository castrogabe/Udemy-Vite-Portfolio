// -------------------------------------------------------------
// ProtectedRoute.jsx — Restrict access to signed-in users only
// -------------------------------------------------------------
// This component is used to wrap pages that should only be
// visible to authenticated (logged-in) users.
//
// Example usage:
// <Route
//   path="/profile"
//   element={
//     <ProtectedRoute>
//       <ProfileScreen />
//     </ProtectedRoute>
//   }
// />
//
// Concepts covered:
// ✅ Using React Context for global user state
// ✅ Redirecting unauthenticated users to Sign In
// ✅ Preserving the original destination after login
// ✅ Route-guard pattern with React Router v6
// -------------------------------------------------------------

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
  // -----------------------------------------------------------
  // 1️⃣ Access the global state (userInfo) from Store Context
  // -----------------------------------------------------------
  const { state } = useContext(Store);
  const { userInfo } = state;

  // useLocation() captures the current route
  // so we can send the user back here after logging in.
  const location = useLocation();

  // -----------------------------------------------------------
  // 2️⃣ If the user is NOT logged in, redirect to Sign In page
  // -----------------------------------------------------------
  // The redirect query string remembers where they came from.
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
  // 3️⃣ If authenticated, render the child component(s)
  // -----------------------------------------------------------
  return children;
}
