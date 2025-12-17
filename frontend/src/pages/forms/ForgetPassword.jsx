// ---------------------------------------------------------------------------
// ForgetPassword.jsx — Lesson 7
// ---------------------------------------------------------------------------
// This page lets a user request a password reset link.
//
// User enters their email → backend sends a reset email with a unique token.
// The token is then used on the ResetPassword page to set a new password.
//
// Key Concepts Demonstrated:
//
//   ✓ How to POST email to backend /forget-password
//   ✓ How to show spinners and disable inputs while submitting
//   ✓ Automatic redirect if already logged in
//   ✓ Optional skeleton loader for smoother page transition
//   ✓ Toast notifications for success + error handling
//
// Back-end route for this:
//   POST /api/users/forget-password
// ---------------------------------------------------------------------------

import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox.jsx';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';

export default function ForgetPassword() {
  const navigate = useNavigate();

  // Read global auth state
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Form fields
  const [email, setEmail] = useState('');

  // Request status
  const [submitting, setSubmitting] = useState(false);

  // Optional: skeleton loader for UI polish
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // If user is already signed in, redirect home
  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  // -------------------------------------------------------------------------
  // Submit handler — sends reset request to backend
  // -------------------------------------------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Call backend route to send reset link
      const res = await fetch('/api/users/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      // Success: show message — backend usually returns { message: "Email sent..." }
      toast.success(data.message || 'Reset link sent', { autoClose: 1200 });
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Optional skeleton loader
  if (isLoading) return <LoadingBox />;

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox (LESSON 7)

  // This LoadingBox is used for UX polish, not for waiting on backend data.

  // Why use it here?
  // - The page renders immediately after navigation
  // - A short delay prevents abrupt layout shifts
  // - It makes the transition feel smoother and more intentional

  // The form does NOT depend on fetched data,
  // so this delay is optional and purely a UI choice.

  // Later lessons will replace this spinner-based approach
  // with Skeleton loaders for a more modern loading experience.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------

  return (
    <div className='content'>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <br />

      <div className='row'>
        {/* --------------------------------------------------------------- */}
        {/* Left column — Form                                             */}
        {/* --------------------------------------------------------------- */}
        <div className='col-12 col-md-6'>
          <h4 className='box'>Forget Password</h4>

          <div className='box' style={{ maxWidth: 640 }}>
            <form onSubmit={submitHandler} noValidate>
              {/* Email field */}
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  required
                  className='form-control'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='email'
                />
              </div>

              {/* Submit button with spinner */}
              <div className='mb-3 d-grid'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={submitting || !email}
                >
                  {submitting ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      />
                      Submitting…
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Right column — Image                                            */}
        {/* --------------------------------------------------------------- */}
        <div className='col-12 col-md-6 d-flex align-items-center justify-content-center mt-3 mt-md-0'>
          <img
            src='/images/forget.jpg'
            alt='Reset password'
            className='img-fluid rounded shadow-sm'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  );
}
