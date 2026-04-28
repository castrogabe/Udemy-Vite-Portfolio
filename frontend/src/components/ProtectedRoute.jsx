import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
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

  return children;
}

// If you want to review the commented teaching version of the ProtectedRoute.jsx setup, check commit lesson-07.
