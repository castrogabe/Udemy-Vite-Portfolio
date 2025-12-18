import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import AdminPagination from '../../components/AdminPagination.jsx';
import { Store } from '../../Store';
import { getError, getImageUrl } from '../../utils'; // lesson-10 getImageUrl

const reducer = (state, action) => {
  switch (action.type) {
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

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

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
  ] = useReducer(reducer, { loading: true, error: '', websites: [] });

  const navigate = useNavigate();
  const { search } = useLocation();
  const page = Number(new URLSearchParams(search).get('page') || 1);

  const { state } = useContext(Store);
  const { userInfo } = state;

  // Load paginated websites
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

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  // Create a new website (your backend sets defaults)
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
        body: JSON.stringify({}), // backend creates default fields
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      toast.success('Website created successfully', { autoClose: 1000 });
      dispatch({ type: 'CREATE_SUCCESS' });
      // Adjust path if your edit route uses /admin/websites/:id instead
      navigate(`/admin/websites/${data.website._id}`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  // Delete a website
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

  return (
    <div className='content'>
      <Helmet>
        <title>Website List</title>
      </Helmet>
      <br />

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

      {loadingCreate && <LoadingBox delay={1000} />}
      {loadingDelete && <LoadingBox delay={1000} />}

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
                          src={getImageUrl(website.image)}
                          alt={website.name}
                          className='img-thumb' // updated portfolio.css
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
                        } // adjust if your edit path is /admin/websites/:id
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

          <AdminPagination
            currentPage={Number(page)}
            totalPages={pages}
            basePath='/admin/websites'
            showIfSinglePage // <-- forces it to render even with one page
          />
          <br />
        </>
      )}
    </div>
  );
}

// If you want to review the commented teaching version of the WebsiteList.jsx setup, check commit lesson-09.
// lesson-10 updated getImageUrl
