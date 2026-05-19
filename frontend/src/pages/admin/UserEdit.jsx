// src/pages/admin/UserEdit.jsx
import { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from '../../components/MessageBox.jsx';
import { Store } from '../../Store';
import { getError } from '../../utils';
import { SkeletonForm } from '../../components/skeletons';
import useDelayedLoading from '../../hooks/useDelayedLoading';
import Wrapper from '../../components/Wrapper.jsx';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEdit() {
  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [fetchDone, setFetchDone] = useState(false);
  const loading = useDelayedLoading(fetchDone, 2000);

  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        await new Promise((r) => setTimeout(r, 1200)); // Simulate delay for skeleton
        const res = await fetch(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
        setName(data.name || '');
        setEmail(data.email || '');
        setIsAdmin(Boolean(data.isAdmin));
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      } finally {
        setFetchDone(true);
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const body = {
        _id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        isAdmin,
      };
      const res = await fetch(`/api/users/${userId}`, {
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
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // ✅ Early returns
  if (loading) return <SkeletonForm />;
  if (error) return <MessageBox variant='danger'>{error}</MessageBox>;

  return (
    // Wrapper is for small screen
    <Wrapper>
      <Helmet>
        <title>Edit User {userId}</title>
      </Helmet>
      <div className='d-flex justify-content-between align-items-center mb-3 w-100'>
        <h4 className='box mb-0'>Edit User {userId}</h4>
        <Link to='/admin/users' className='btn btn-outline-secondary'>
          Back
        </Link>
      </div>

      <div className='box' style={{ maxWidth: 640, width: '100%' }}>
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

          <div className='form-check mb-3'>
            <input
              className='form-check-input'
              type='checkbox'
              id='isAdmin'
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label className='form-check-label' htmlFor='isAdmin'>
              isAdmin
            </label>
          </div>

          <div className='mb-3 d-grid'>
            <button
              className='btn btn-primary'
              type='submit'
              disabled={loadingUpdate || !name || !email}
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
    </Wrapper>
  );
}

// If you want to review the commented teaching version of the UserEdit.jsx setup, check commit lesson-08.
// lesson-15 Skeletons
