// src/components/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const location = useLocation();

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
  if (!userInfo.isAdmin) return <Navigate to='/' replace />;

  return children;
}

// If you want to review the commented teaching version of the AdminRoute.jsx setup, check commit lesson-06.
