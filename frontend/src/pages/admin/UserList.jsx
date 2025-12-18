// -------------------------------------------------------------
// UserList.jsx — Admin: List, Edit, and Delete Users
// -------------------------------------------------------------
// This screen shows a paginated list of all registered users.
// Admins can:
//   ✓ View users
//   ✓ Navigate through pages of results
//   ✓ Edit a user
//   ✓ Delete a user
//
// Concepts covered in this lesson:
// -------------------------------------------------------------
// ▸ useReducer for multi-state management (fetch, delete, errors)
// ▸ useEffect to fetch paginated admin data
// ▸ Protecting admin endpoints with Authorization headers
// ▸ Deleting a user with optimistic refresh
// ▸ Using AdminPagination with a dedicated basePath
// ▸ Reusing LoadingBox + MessageBox + Bootstrap responsive tables
// -------------------------------------------------------------

import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import AdminPagination from '../../components/AdminPagination.jsx';
import { Store } from '../../Store';
import { getError } from '../../utils';

// -------------------------------------------------------------
// Reducer: handles all loading/error/fetch/delete state
// -------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    // Fetching list
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        users: action.payload.users || [],
        totalUsers: action.payload.totalUsers ?? 0,
        page: action.payload.page ?? 1,
        pages: action.payload.pages ?? 1,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Deleting a user
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function UserList() {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // Read ?page=X from the URL (default page = 1)
  // -------------------------------------------------------------
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = Number(sp.get('page') || 1);

  // -------------------------------------------------------------
  // Component state from the reducer
  // -------------------------------------------------------------
  const [
    { loading, error, users, totalUsers, loadingDelete, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, { loading: true, error: '', users: [] });

  // Global auth
  const { state } = useContext(Store);
  const { userInfo } = state;

  // -------------------------------------------------------------
  // Fetch paginated user list
  // GET /api/users/admin?page=X
  // -------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const res = await fetch(`/api/users/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    // If a delete just completed, reset deletion state then re-fetch
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // -------------------------------------------------------------
  // Delete a user (admin only)
  // DELETE /api/users/:id
  // -------------------------------------------------------------
  const deleteHandler = async (user) => {
    if (!window.confirm('Are you sure to delete?')) return;

    try {
      dispatch({ type: 'DELETE_REQUEST' });

      const res = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);

      toast.success('User deleted successfully', { autoClose: 1000 });
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELETE_FAIL' });
    }
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox

  // This page must wait for data before rendering the table.

  // Why?
  // - We are fetching a PAGINATED list of users from the backend
  // - Table rows, edit links, and delete actions all depend on valid data
  // - Pagination controls require the total page count from the server

  // Rendering the table before the data arrives would result in
  // empty rows, broken actions, or an unstable UI.

  // LoadingBox ensures the admin only sees the table
  // AFTER the user data has finished loading.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <br />

      {/* Title displays total user count */}
      <h4 className='box'>Users ({totalUsers ?? 'Loading...'})</h4>

      <div className='box'>
        {/* Deleting overlay */}
        {loadingDelete && <LoadingBox />}

        {/* Conditional body */}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <div className='table-responsive'>
            <table className='table table-striped table-bordered align-middle noWrap'>
              <thead className='thead'>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>IS ADMIN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {/* Render users */}
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>

                    <td className='text-nowrap'>
                      {/* Edit */}
                      <button
                        type='button'
                        className='btn btn-primary btn-sm'
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        Edit
                      </button>{' '}
                      {/* Delete */}
                      <button
                        type='button'
                        className='btn btn-danger btn-sm'
                        onClick={() => deleteHandler(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* No results */}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className='text-center'>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination — Lesson 8 uses basePath instead of keyword */}
      <AdminPagination
        currentPage={page}
        totalPages={pages}
        basePath='/admin/users'
      />
      <br />
    </div>
  );
}
