import { useContext, useReducer, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function Profile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const passwordsMismatch = useMemo(
    () =>
      (password.length > 0 || confirmPassword.length > 0) &&
      password !== confirmPassword,
    [password, confirmPassword]
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    if (passwordsMismatch) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      const body = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };
      if (password) body.password = password;

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully', { autoClose: 1000 });

      // clear password fields after success
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div className='content'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <br />
      <h4 className='box'>User Profile</h4>

      <div className='box' style={{ maxWidth: 640 }}>
        <form onSubmit={submitHandler} noValidate>
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

// If you want to review the commented teaching version of the Profile.jsx setup, check commit lesson-07.
