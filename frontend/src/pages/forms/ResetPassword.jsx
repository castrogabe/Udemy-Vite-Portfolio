import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox.jsx';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // optional page skeleton
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // bounce if logged in or token missing
  useEffect(() => {
    if (userInfo || !token) navigate('/');
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
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

  if (isLoading) return <LoadingBox />;

  const passwordsMismatch =
    (password.length > 0 || confirmPassword.length > 0) &&
    password !== confirmPassword;

  return (
    <div className='content'>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <br />
      <h4 className='box'>Reset Password</h4>

      <div className='box' style={{ maxWidth: 640 }}>
        <form onSubmit={submitHandler} noValidate>
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
            {confirmPassword.length > 0 && passwordsMismatch && (
              <div className='invalid-feedback' style={{ display: 'block' }}>
                Passwords do not match
              </div>
            )}
          </div>

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

// If you want to review the commented teaching version of the ResetPassword.jsx setup, check commit lesson-07.
