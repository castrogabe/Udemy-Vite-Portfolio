// ---------------------------------------------------------------------------
// Profile.jsx — Lesson 7
// ---------------------------------------------------------------------------
// This page allows logged-in users to update their own:
//
//   • Name
//   • Email
//   • Password (optional)
//
// Key Concepts Demonstrated:
//
//   ✓ Using useContext to access global userInfo
//   ✓ Using useReducer for request loading state
//   ✓ Using useMemo to compute "passwords mismatch"
//   ✓ Updating user info in localStorage and global Store
//   ✓ Conditionally sending the password only when changed
//   ✓ show/hide password toggles for both fields
//
// IMPORTANT:
// The backend route for this is:
//   PUT /api/users/profile   (requires auth token)
// ---------------------------------------------------------------------------

import { useContext, useReducer, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

// ---------------------------------------------------------------------------
// Reducer for managing update request states
// ---------------------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };

    // Both success and failure stop the loading spinner
    case 'UPDATE_SUCCESS':
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function Profile() {
  // Access user info from global Store
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Pre-fill fields from existing userInfo
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');

  // Passwords (optional)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local reducer for tracking request state
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // Whether new passwords fail to match
  const passwordsMismatch = useMemo(
    () =>
      (password.length > 0 || confirmPassword.length > 0) &&
      password !== confirmPassword,
    [password, confirmPassword]
  );

  // -------------------------------------------------------------------------
  // Submit handler — sends updated fields to backend
  // -------------------------------------------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    if (passwordsMismatch) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      // Only send password if user typed one
      const body = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };
      if (password) body.password = password;

      // Call backend route
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Auth required
        },
        body: JSON.stringify(body),
      });

      // Parse response safely
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      // Success: update global userInfo
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('User updated successfully', { autoClose: 1000 });

      // Clear password fields after successful update
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT Loading States (IMPORTANT FOR STUDENTS)

  // This page does NOT use <LoadingBox /> on initial render.

  // Why?
  // - User data already exists in global Store (userInfo)
  // - No backend fetch is required when the page loads
  // - The form can safely render immediately

  // Instead, loading feedback is shown ONLY during submission
  // using a button-level spinner (loadingUpdate).

  // This demonstrates that loading UI should be:
  // - contextual
  // - minimal
  // - applied only where necessary
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      <br />
      <h4 className='box'>User Profile</h4>

      <div className='box' style={{ maxWidth: 640 }}>
        <form onSubmit={submitHandler} noValidate>
          {/* --------------------------------------------------------------- */}
          {/* Name                                                           */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Name
            </label>
            <input
              id='name'
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete='name'
              required
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Email                                                          */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* New Password (optional)                                        */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              New Password
            </label>

            <div className='input-group'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                className='form-control'
                placeholder='Min 8, 1 upper, 1 lower, 1 digit, 1 special'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='new-password'
              />
              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                />
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Confirm Password                                                */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3'>
            <label htmlFor='confirmPassword' className='form-label'>
              Confirm New Password
            </label>

            <div className='input-group'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${
                  confirmPassword.length > 0
                    ? passwordsMismatch
                      ? 'is-invalid'
                      : 'is-valid'
                    : ''
                }`}
                placeholder='Repeat new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete='new-password'
              />

              <button
                type='button'
                className='btn btn-outline-secondary'
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                <i
                  className={`fa ${
                    showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                  }`}
                />
              </button>
            </div>

            {/* Validation feedback */}
            {confirmPassword.length > 0 && passwordsMismatch && (
              <div className='invalid-feedback' style={{ display: 'block' }}>
                Passwords do not match
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Submit button with loading spinner                             */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3 d-grid'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loadingUpdate || !name || !email || passwordsMismatch}
            >
              {loadingUpdate ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  />
                  Updating…
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
