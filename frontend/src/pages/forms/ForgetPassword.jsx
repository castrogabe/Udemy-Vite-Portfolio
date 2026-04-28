import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../../components/LoadingBox.jsx';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../../utils';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // (optional) page skeleton loader like your original
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // if signed in, bounce home
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

  if (isLoading) return <LoadingBox />;

  return (
    <div className='content'>
      <Helmet>
        <title>Forget Password</title>
      </Helmet>
      <br />
      <div className='row'>
        {/* Left: form */}
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

        {/* Right: image */}
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
