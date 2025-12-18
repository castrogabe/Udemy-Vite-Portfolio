// -------------------------------------------------------------
// UserEdit.jsx — Admin: Edit a Single User
// -------------------------------------------------------------
// This screen lets an admin update a user’s:
//   ✓ name
//   ✓ email
//   ✓ admin status
//
// Concepts covered in this lesson:
// -------------------------------------------------------------
// ▸ useReducer for managing loading/error/update states
// ▸ Fetching a single user’s data using useParams()
// ▸ Submitting an authenticated PUT request to update the user
// ▸ Reusing LoadingBox + MessageBox components
// ▸ Secure admin-only flow (ProtectedRoute + admin check)
// ▸ Navigating back to the UserList screen after updating
// -------------------------------------------------------------

import { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import { Store } from '../../Store';
import { getError } from '../../utils';

// -------------------------------------------------------------
// Reducer handles all fetch/update loading + error states
// -------------------------------------------------------------
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
  // Local reducer
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
  });

  // Global auth state
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Router helpers
  const { id: userId } = useParams(); // get :id from the URL
  const navigate = useNavigate();

  // Local form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // -------------------------------------------------------------
  // Fetch user data by ID (admin-only route)
  // GET /api/users/:id
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const res = await fetch(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

        // Prefill form
        setName(data.name || '');
        setEmail(data.email || '');
        setIsAdmin(Boolean(data.isAdmin));

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [userId, userInfo]);

  // -------------------------------------------------------------
  // Submit updated user data
  // PUT /api/users/:id
  // -------------------------------------------------------------
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

      // Back to admin user list
      navigate('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox

  // This page must wait for user data before rendering the edit form.

  // Why?
  // - We are editing ONE specific user
  // - The user ID comes from the URL (useParams)
  // - The form depends on data fetched from the backend

  // Showing the form before the data arrives would result in
  // empty or incorrect inputs and a confusing user experience.

  // LoadingBox ensures the form only renders
  // AFTER the user data has finished loading.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------

  return (
    <div className='content'>
      <Helmet>
        <title>Edit User {userId}</title>
      </Helmet>
      <br />

      {/* Page title + back button */}
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='box mb-0'>Edit User {userId}</h4>
        <Link to='/admin/users' className='btn btn-outline-secondary'>
          Back
        </Link>
      </div>

      {/* Loading / error / form */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div className='box' style={{ maxWidth: 640 }}>
          <form onSubmit={submitHandler} noValidate>
            {/* Name */}
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

            {/* Email */}
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

            {/* Admin toggle */}
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

            {/* Submit */}
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
      )}
    </div>
  );
}
