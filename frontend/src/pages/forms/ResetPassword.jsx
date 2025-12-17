// ---------------------------------------------------------------------------
// ResetPassword.jsx — Lesson 7
// ---------------------------------------------------------------------------
// This page handles the "Reset Password" form using the token from the email.
// Workflow:
//
//   1. User clicks a reset-password link emailed to them:
//        /reset-password/:token
//
//   2. This page reads the token from the URL using useParams()
//
//   3. The user enters a new password + confirm password
//
//   4. Form submits POST /api/users/reset-password
//        { password, token }
//
//   5. On success → show toast and redirect to Sign In.
//
// Additional features included:
//   • Local skeleton loading to avoid layout shift
//   • Redirect away if user is already logged in
//   • Simple password matching validator
//   • Show/hide password toggles
// ---------------------------------------------------------------------------

import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox.jsx';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // Reset token from URL
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Form fields and visibility toggles
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submission spinner
  const [submitting, setSubmitting] = useState(false);

  // Skeleton placeholder for page loading animation
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // -------------------------------------------------------------------------
  // Redirect away if:
  //   • User is already logged in
  //   • No valid token in URL
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (userInfo || !token) navigate('/');
  }, [navigate, userInfo, token]);

  // -------------------------------------------------------------------------
  // Form submit handler
  // -------------------------------------------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    // Local password match validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);

      // POST new password + token
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      toast.success('Password updated successfully', { autoClose: 1000 });
      navigate('/signin');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // While loading skeleton is active, show placeholder spinner
  if (isLoading) return <LoadingBox />;

  // Simple mismatch boolean for controlling validation UI
  const passwordsMismatch =
    (password.length > 0 || confirmPassword.length > 0) &&
    password !== confirmPassword;

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox (LESSON 7)

  // This LoadingBox is NOT waiting for backend data.

  // Instead, it is used as a short, intentional delay to:
  // - Prevent abrupt layout shifts
  // - Smooth the page transition when arriving from the email link
  // - Give the UI a more polished, professional feel

  // The token is already available from the URL,
  // so the form could render immediately — but this brief delay
  // improves perceived performance and UX.

  // In later lessons, this same idea will be expanded using
  // Skeleton loaders instead of spinners.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      <br />
      <h4 className='box'>Reset Password</h4>

      <div className='box' style={{ maxWidth: 640 }}>
        <form onSubmit={submitHandler} noValidate>
          {/* --------------------------------------------------------------- */}
          {/* New Password                                                   */}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='new-password'
              />

              {/* Toggle button */}
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
          {/* Confirm New Password                                           */}
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
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete='new-password'
              />

              {/* Toggle button */}
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

            {/* Validation message */}
            {confirmPassword.length > 0 && passwordsMismatch && (
              <div className='invalid-feedback' style={{ display: 'block' }}>
                Passwords do not match
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Submit button with spinner                                     */}
          {/* --------------------------------------------------------------- */}
          <div className='mb-3 d-grid'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={
                submitting || !password || !confirmPassword || passwordsMismatch
              }
            >
              {submitting ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  />
                  Resetting…
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
