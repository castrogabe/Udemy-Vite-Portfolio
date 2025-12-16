// -------------------------------------------------------------
// Signin.jsx — User Login Form
// -------------------------------------------------------------
// This screen handles user authentication via the backend /api/users/signin route.
//
// Concepts covered:
// React form handling with useState
// Context (Store) integration for global login state
// Secure API call with fetch()
// Redirect logic after login
// Password visibility toggle
// UI loading state
// toast error handling
// -------------------------------------------------------------

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

export default function Signin() {
  const navigate = useNavigate();

  // -----------------------------------------------------------
  // Capture redirect query param (e.g., /signin?redirect=/checkout)
  // -----------------------------------------------------------
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  // -----------------------------------------------------------
  // Local component state
  // -----------------------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------------------------
  // Global state: access Store context
  // -----------------------------------------------------------
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // -----------------------------------------------------------
  // Redirect if already signed in
  // -----------------------------------------------------------
  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  // -----------------------------------------------------------
  // Handle form submission
  // -----------------------------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Send credentials to backend
      const res = await fetch('/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // Handle non-200 responses
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.message || `HTTP ${res.status}`);
      }

      // Parse successful response
      const data = await res.json();

      // Save to global context + localStorage
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Redirect user
      navigate(redirect || '/');
    } catch (err) {
      // Show any API or network error
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <br />
      <h1 className='box'>Sign In</h1>

      {/* Two-column responsive layout */}
      <div className='row'>
        {/* -----------------------------------------------------
            Left Column: Sign-in Form
        ----------------------------------------------------- */}
        <div className='col-12 col-md-6'>
          <div className='box' style={{ maxWidth: 640, marginBottom: '1rem' }}>
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
                  autoComplete='email'
                  className='form-control'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field with toggle visibility */}
              <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                  Password
                </label>
                <div className='input-group'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete='current-password'
                    placeholder='Min 8, 1 upper, 1 lower, 1 digit, 1 special'
                    className='form-control'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type='button'
                    className='btn btn-outline-secondary'
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <i
                      className={`fa ${
                        showPassword ? 'fa-eye-slash' : 'fa-eye'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className='mb-3'>
                <button
                  className='btn btn-primary'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </div>

              {/* Links */}
              <div className='mb-2'>
                New customer?{' '}
                <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`}>
                  Create your account
                </Link>
              </div>

              <div className='mb-3'>
                Forgot password?{' '}
                <Link to='/forgot-password'>Reset Password</Link>
              </div>
            </form>
          </div>
        </div>

        {/* -----------------------------------------------------
            Right Column: Illustration Image
        ----------------------------------------------------- */}
        <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
          <img
            src='/images/signin.png'
            alt='Sign in illustration'
            className='img-fluid rounded shadow-sm'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  );
}
