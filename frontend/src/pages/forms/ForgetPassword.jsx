import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';
import { SkeletonForm } from '../../components/skeletons';
import useDelayedLoading from '../../hooks/useDelayedLoading';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ✅ skeleton control
  const [fetchDone, setFetchDone] = useState(false);
  const delayedLoading = useDelayedLoading(fetchDone, 1200);

  useEffect(() => {
    const timer = setTimeout(() => setFetchDone(true), 800); // smooth skeleton transition
    return () => clearTimeout(timer);
  }, []);

  // redirect if already logged in
  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/users/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      toast.success(data.message || 'Reset link sent', { autoClose: 1200 });
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ skeleton display
  if (delayedLoading) return <SkeletonForm />;

  return (
    <div className='content'>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <br />

      <div className='row'>
        {/* Left column - form */}
        <div className='col-12 col-md-6'>
          <h4 className='box'>Forget Password</h4>
          <div className='box' style={{ maxWidth: 640 }}>
            <form onSubmit={submitHandler} noValidate>
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

        {/* Right column - illustration */}
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

// If you want to review the commented teaching version of the ForgetPassword.jsx setup, check commit lesson-07.
// Lesson-14 Skeletons
