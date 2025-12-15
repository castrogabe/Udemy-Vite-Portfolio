// src/pages/Portfolio.jsx
// -------------------------------------------------------------
// This page displays a dynamic list of websites (your portfolio projects)
// fetched from the backend API, with pagination and error handling.
// It demonstrates how to use useReducer for complex state management
// and how to integrate frontend data fetching with Express routes.
// -------------------------------------------------------------

import { useEffect, useReducer } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components/MessageBox.jsx';
import WebsiteCard from '../components/WebsiteCard.jsx';
import Pagination from '../components/Pagination.jsx';

// -------------------------------------------------------------
// Environment variable for API base URL
// - You can define VITE_API_URL in your .env files for flexibility.
// - Example: VITE_API_URL="https://my-portfolio-backend.onrender.com"
// -------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL ?? '';

// -------------------------------------------------------------
// Reducer function: manages all loading, success, and error states.
// This keeps the logic organized, especially when handling async requests.
// -------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    // When a request begins, show loading spinner
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    // When request succeeds, save data to state
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

    // When request fails, stop loading and store the error message
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload || 'Request failed',
      };

    // Default case: return unchanged state
    default:
      return state;
  }
};

// -------------------------------------------------------------
// Component: Portfolio
// -------------------------------------------------------------
export default function Portfolio() {
  // useSearchParams allows us to read and update the URL query string (?page=2)
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert query param to a number, defaulting to page 1
  const page = Number(searchParams.get('page') || 1);

  // useReducer manages async loading, error, and data states
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

  // -------------------------------------------------------------
  // useEffect: fetch website data whenever the "page" number changes
  // -------------------------------------------------------------
  useEffect(() => {
    let ignore = false; // Prevents state updates if component unmounts mid-request

    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); // Start loading

      try {
        // Fetch paginated websites from the backend
        const res = await fetch(
          `${API_BASE}/api/websites/search?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies if used for auth (optional)
          }
        );

        // If server returns an error, throw for catch block
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        // Parse the JSON response
        const data = await res.json();

        // Only update if component is still mounted
        if (!ignore) dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        if (!ignore) dispatch({ type: 'FETCH_FAIL', payload: err?.message });
      }
    };

    fetchData();

    // Cleanup function to avoid memory leaks
    return () => {
      ignore = true;
    };
  }, [page]); // Dependency: runs again when "page" changes

  // -------------------------------------------------------------
  // Helper: Builds pagination URLs (ex: /portfolio?page=3)
  // -------------------------------------------------------------
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return { pathname: '/portfolio', search: `?page=${filterPage}` };
  };

  // Updates the URL when a new page number is clicked
  const goToPage = (p) => setSearchParams({ page: String(p) });

  // -------------------------------------------------------------
  // Render the UI
  // -------------------------------------------------------------
  return (
    <div className='content'>
      {/* Helmet dynamically sets the document title for SEO */}
      <Helmet>
        <title>Portfolio</title>
      </Helmet>

      <br />

      {/* Intro section with call-to-action button */}
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

      {/* -------------------------------------------------------------
        Conditional Rendering:
        - Show LoadingBox if still fetching
        - Show MessageBox on error
        - Otherwise, display the data grid
      ------------------------------------------------------------- */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          {/* No websites found message */}
          {websites.length === 0 && <MessageBox>No Website Found</MessageBox>}

          {/* Website grid layout */}
          <div className='row g-3'>
            {websites.map((website, idx) => (
              <div className='col-12 box' key={idx}>
                {/* Reusable WebsiteCard component displays project details */}
                <WebsiteCard website={website} />
              </div>
            ))}
          </div>

          {/* Pagination control at the bottom */}
          <Pagination
            currentPage={page}
            totalPages={pages}
            getFilterUrl={getFilterUrl}
            onPageChange={goToPage}
          />

          <br />
        </>
      )}
    </div>
  );
}
