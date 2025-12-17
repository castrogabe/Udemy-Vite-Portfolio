import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

export default function Signup() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const passwordsMatch = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <br />
      <h4 className='box'>Sign Up</h4>

      {/* Two-column layout */}
      <div className='row'>
        {/* Left: form */}
        <div className='col-12 col-md-6'>
          <div className='box' style={{ maxWidth: 640, marginBottom: '1rem' }}>
            <form onSubmit={submitHandler} noValidate>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  id='name'
                  required
                  autoComplete='name'
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                  Password
                </label>
                <div className='input-group'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Min 8, 1 upper, 1 lower, 1 digit, 1 special'
                    required
                    autoComplete='new-password'
                    className='form-control'
                    value={password}
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

              <div className='mb-3'>
                <label htmlFor='confirmPassword' className='form-label'>
                  Confirm Password
                </label>
                <div className='input-group'>
                  <input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    required
                    autoComplete='new-password'
                    className={`form-control ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'is-valid'
                          : 'is-invalid'
                        : ''
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <div
                    className='invalid-feedback'
                    style={{ display: 'block' }}
                  >
                    Passwords do not match
                  </div>
                )}
              </div>

              <div className='mb-3'>
                <button
                  className='btn btn-primary'
                  type='submit'
                  disabled={loading || !name || !email || !passwordsMatch}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </button>
              </div>

              <div className='mb-3'>
                Already have an account?{' '}
                <Link to={`/signin?redirect=${encodeURIComponent(redirect)}`}>
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right: image */}
        <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
          <img
            src='/images/register.png'
            alt='register'
            className='img-fluid rounded shadow-sm'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  );
}

// If you want to review the commented teaching version of the Signup.jsx setup, check commit lesson-06.
