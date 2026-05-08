import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import AdminPagination from '../../components/AdminPagination.jsx';
import { Store } from '../../Store';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
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
  const { search } = useLocation();
  const page = Number(new URLSearchParams(search).get('page') || 1);

  const [
    { loading, error, users, totalUsers, loadingDelete, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, { loading: true, error: '', users: [] });

  const { state } = useContext(Store);
  const { userInfo } = state;

  // fetch paged users
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

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // delete a user
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

  return (
    <div className='content'>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <br />
      <h4 className='box'>Users ({totalUsers ?? 'Loading...'})</h4>

      <div className='box'>
        {loadingDelete && <LoadingBox />}
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
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                    <td className='text-nowrap'>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm'
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        Edit
                      </button>{' '}
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

      <AdminPagination
        currentPage={page}
        totalPages={pages}
        basePath='/admin/users'
        showIfSinglePage // <-- forces it to render even with one page
      />
      <br />
    </div>
  );
}

// If you want to review the commented teaching version of the UserList.jsx setup, check commit lesson-08.
