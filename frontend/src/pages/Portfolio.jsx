// src/pages/Portfolio.jsx
import { useEffect, useReducer } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components/MessageBox.jsx';
import WebsiteCard from '../components/WebsiteCard.jsx';
import Pagination from '../components/Pagination.jsx';

// If you have an API base URL, set VITE_API_URL in .env.* files
const API_BASE = import.meta.env.VITE_API_URL ?? '';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        websites: action.payload.websites,
        page: action.payload.page,
        pages: action.payload.pages,
        countWebsites: action.payload.countWebsites,
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload || 'Request failed',
      };
    default:
      return state;
  }
};

export default function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const [{ loading, error, websites = [], pages = 0 }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      websites: [],
      page: 1,
      pages: 0,
      countWebsites: 0,
    }
  );

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await fetch(
          `${API_BASE}/api/websites/search?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // remove if you don't use cookies
          }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!ignore) dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        if (!ignore) dispatch({ type: 'FETCH_FAIL', payload: err?.message });
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [page]);

  // For your Pagination component
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    // if your route is /portfolio, keep the path in links
    return { pathname: '/portfolio', search: `?page=${filterPage}` };
  };

  const goToPage = (p) => setSearchParams({ page: String(p) });

  return (
    <div className='content'>
      <Helmet>
        <title>Portfolio</title>
      </Helmet>

      <br />
      <div className='box'>
        <p>
          ~ Discover the creativity and innovation in our meticulously crafted
          website portfolio. Dive into our collection and get inspired! ~
        </p>
        <Link to='/contact'>
          <button className='btn btn-primary mt-3'>Contact for Quote</button>
        </Link>
      </div>

      <br />

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          {websites.length === 0 && <MessageBox>No Website Found</MessageBox>}

          {/* Grid without react-bootstrap */}
          <div className='row g-3'>
            {websites.map((website, idx) => (
              <div className='col-12 box' key={idx}>
                <WebsiteCard website={website} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={pages}
            getFilterUrl={getFilterUrl}
            onPageChange={goToPage} // if your Pagination can call this; otherwise it can use getFilterUrl
          />
          <br />
        </>
      )}
    </div>
  );
}

// If you want to review the commented teaching version of the Portfolio.jsx setup, check commit lesson-03.
