// -----------------------------------------------------------------------------
// WebsiteList.jsx — Lesson 9 (Admin Website Management)
// -----------------------------------------------------------------------------
//
// This page displays a **paginated table** of all websites in the portfolio.
// Admin users can:
//
//   • View all websites
//   • Create a new website (backend generates defaults)
//   • Edit existing websites
//   • Delete websites
//   • Navigate pages using AdminPagination
//
// Concepts Covered:
// -----------------------------------------------------------------------------
// ✔ useReducer() for multi-state loading/display handling
// ✔ Fetching paginated results from backend
// ✔ Creating a new website record (POST /api/websites)
// ✔ Deleting records with confirmation dialogs
// ✔ Navigating with useNavigate()
// ✔ Passing basePath to AdminPagination (Lesson 9 best practice)
// ✔ Rendering responsive tables with images + links
//
// Backend API Calls Used:
//   GET    /api/websites/admin?page=#
// –  POST   /api/websites
// –  DELETE /api/websites/:id
//
// -----------------------------------------------------------------------------

import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import AdminPagination from '../../components/AdminPagination.jsx';
import { Store } from '../../Store';
import { getError } from '../../utils';

// -----------------------------------------------------------------------------
// Reducer to control all loading/error/success states for:
//   • FETCH   (loading main list)
//   • CREATE  (loadingCreate)
//   • DELETE  (loadingDelete / successDelete)
// -----------------------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    // Load websites
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        websites: action.payload.websites || [],
        totalWebsites: action.payload.totalWebsites ?? 0,
        page: action.payload.page ?? 1,
        pages: action.payload.pages ?? 1,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Create website
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    // Delete website
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function WebsiteList() {
  // Reducer state
  const [
    {
      loading,
      error,
      websites,
      totalWebsites,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    websites: [],
  });

  const navigate = useNavigate();
  const { search } = useLocation();

  // Current page number from URL (?page=)
  const page = Number(new URLSearchParams(search).get('page') || 1);

  const { state } = useContext(Store);
  const { userInfo } = state;

  // -----------------------------------------------------------------------------
  // Fetch paginated website data
  // -----------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const res = await fetch(`/api/websites/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    // After delete, automatically refresh list
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // -----------------------------------------------------------------------------
  // Create a new website
  // Backend builds default fields (name, slug, etc.)
  // Then user is sent directly to the edit screen
  // -----------------------------------------------------------------------------
  const createHandler = async () => {
    if (!window.confirm('Are you sure to create?')) return;

    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({}), // backend fills defaults
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      toast.success('Website created successfully', { autoClose: 1000 });
      dispatch({ type: 'CREATE_SUCCESS' });

      navigate(`/admin/websites/${data.website._id}`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  // -----------------------------------------------------------------------------
  // Delete a website (with confirmation)
  // -----------------------------------------------------------------------------
  const deleteHandler = async (website) => {
    if (!window.confirm('Are you sure to delete?')) return;

    try {
      dispatch({ type: 'DELETE_REQUEST' });

      const res = await fetch(`/api/websites/${website._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);

      toast.success('Website deleted successfully', { autoClose: 1000 });
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELETE_FAIL' });
    }
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox (IMPORTANT FOR NEW STUDENTS)

  // This page MUST wait for data before rendering the table.

  // Why?
  // - We are fetching a LIST of websites from the backend
  // - The table depends entirely on async data
  // - Pagination, edit buttons, and images all require valid data

  // If we rendered the table immediately:
  // - Rows would be empty
  // - Buttons could break or point to invalid IDs
  // - The UI would feel unstable or confusing

  // LoadingBox ensures the admin only sees the table
  // AFTER the website data has finished loading.

  // Later lessons will replace LoadingBox with Skeleton tables,
  // but the conditional rendering logic stays exactly the same.
  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // UI Rendering
  // -----------------------------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Website List</title>
      </Helmet>
      <br />

      {/* Header + Create Button */}
      <div className='row box align-items-center'>
        <div className='col-12 col-md-6'>
          <h4 className='mb-0'>
            Website List Page (
            {totalWebsites !== undefined ? totalWebsites : 'Loading...'}{' '}
            Websites Database)
          </h4>
        </div>

        <div className='col-12 col-md-6 text-md-end mt-3 mt-md-0'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={createHandler}
          >
            Create Website
          </button>
        </div>
      </div>

      {/* Loaders for create/delete */}
      {loadingCreate && <LoadingBox delay={1000} />}
      {loadingDelete && <LoadingBox delay={1000} />}

      {/* Main Table */}
      {loading ? (
        <LoadingBox delay={1000} />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          <div className='box table-responsive'>
            <table className='table table-striped table-bordered align-middle noWrap'>
              <thead className='thead'>
                <tr>
                  <th>ID / Image / Slug</th>
                  <th>NAME</th>
                  <th>LANGUAGE</th>
                  <th>LANGUAGE DESCRIPTION</th>
                  <th>DESCRIPTION</th>
                  <th>LINK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {websites.map((website) => (
                  <tr key={website._id}>
                    <td>
                      {website._id}
                      <div className='mt-2'>
                        <img
                          src={website.image}
                          alt={website.name}
                          className='img-fluid rounded img-thumbnail'
                          style={{ width: '225px', height: 'auto' }}
                        />
                        <br />
                        <Link to={`/website/${website.slug}`}>
                          {website.slug}
                        </Link>
                      </div>
                    </td>

                    <td>{website.name}</td>
                    <td>{website.language}</td>
                    <td>{website.languageDescription}</td>

                    {/* Description is long, so this cell can wrap */}
                    <td className='description-cell'>{website.description}</td>

                    <td>
                      <a
                        href={website.link}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {website.link}
                      </a>
                    </td>

                    <td className='text-nowrap'>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm'
                        onClick={() =>
                          navigate(`/admin/websites/${website._id}`)
                        }
                      >
                        Edit
                      </button>{' '}
                      <button
                        type='button'
                        className='btn btn-danger btn-sm'
                        onClick={() => deleteHandler(website)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {websites.length === 0 && (
                  <tr>
                    <td colSpan={7} className='text-center'>
                      No websites found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — Lesson 9 version */}
          <AdminPagination
            currentPage={Number(page)}
            totalPages={pages}
            basePath='/admin/websites'
            showIfSinglePage // force show for consistency
          />
          <br />
        </>
      )}
    </div>
  );
}
