import { useEffect, useReducer, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox.jsx';
import WebsiteCard from '../components/WebsiteCard.jsx';
import Pagination from '../components/Pagination.jsx';
import useDelayedLoading from '../hooks/useDelayedLoading';
import { SkeletonBase, SkeletonList } from '../components/skeletons';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Reducer for the website list
const websiteReducer = (state, action) => {
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

  // Intro content state
  const [portfolioContent, setPortfolioContent] = useState({
    paragraphs: [],
    link: '/contact',
    linkText: 'Contact for Quote',
  });
  const [contentLoaded, setContentLoaded] = useState(false);
  const [contentError, setContentError] = useState('');

  // Custom delayed loading hook (ensures skeleton is visible for at least 2s)
  const contentLoading = useDelayedLoading(contentLoaded, 2000);

  // Reducer for website list
  const [{ loading, error, websites = [], pages = 0 }, dispatch] = useReducer(
    websiteReducer,
    {
      loading: true,
      error: '',
      websites: [],
      page: 1,
      pages: 0,
      countWebsites: 0,
    }
  );

  // Fetch Portfolio Intro Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/portfoliocontent`);
        const data = await res.json();
        if (res.ok) {
          setPortfolioContent({
            paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : [],
            link: data.link || '/contact',
            linkText: data.linkText || 'Contact for Quote',
          });
          setContentError('');
        } else {
          setContentError(data.message || 'Failed to load intro content');
        }
      } catch (err) {
        setContentError(err.message || 'Network error fetching intro content');
      } finally {
        setContentLoaded(true);
      }
    };
    fetchContent();
  }, []);

  // Fetch Websites (with pagination)
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await fetch(
          `${API_BASE}/api/websites/search?page=${page}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ignore) dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        if (!ignore) dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [page]);

  // Helpers
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
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
        {contentLoading ? (
          <SkeletonBase />
        ) : contentError ? (
          <MessageBox variant='danger'>{contentError}</MessageBox>
        ) : (
          <>
            {portfolioContent.paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
            {portfolioContent.link && portfolioContent.linkText && (
              <Link to={portfolioContent.link}>
                <button className='btn btn-primary mt-3'>
                  {portfolioContent.linkText}
                </button>
              </Link>
            )}
          </>
        )}
      </div>

      <br />

      {/* Website list */}
      {loading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <SkeletonList key={i} />
          ))}
        </>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          {websites.length === 0 && <MessageBox>No Website Found</MessageBox>}
          <div className='row g-3'>
            {websites.map((website, idx) => (
              <div className='col-12 box' key={idx}>
                <WebsiteCard website={website} />
              </div>
            ))}
          </div>
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

// If you want to review the commented teaching version
// of the Portfolio.jsx setup, check commit lesson-14.

// lesson-14:
// • Dynamic portfolio intro content powered by portfolioContentModel
// • Dynamic website cards powered by websiteModel
// • Pagination support added
// • WebsiteCard reused for portfolio rendering
// • URL-based pagination using search params
// • Separate loading states for CMS content + website cards

// lesson-15 Skeletons
