// src/pages/Portfolio.jsx — Lesson 14 (Dynamic Portfolio Page)

import { useEffect, useReducer, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components/MessageBox.jsx';
import WebsiteCard from '../components/WebsiteCard.jsx';
import Pagination from '../components/Pagination.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// -----------------------------------------------------------------------------
// Lesson 14:
// Reducer for dynamic portfolio website items
//
// Why useReducer instead of useState?
// - multiple related state updates
// - cleaner async loading flow
// - easier pagination handling
// - scales better as filtering/searching grows later
// -----------------------------------------------------------------------------
const websiteReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: '',
      };

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
        error: action.payload,
      };

    default:
      return state;
  }
};

export default function Portfolio() {
  // -----------------------------------------------------------------------------
  // Lesson 14:
  // Pagination now uses URL search params
  //
  // Example:
  // /portfolio?page=2
  //
  // This keeps pagination:
  // • bookmarkable
  // • shareable
  // • browser-history friendly
  // -----------------------------------------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  // -----------------------------------------------------------------------------
  // Lesson 14:
  // Dynamic portfolio intro content
  //
  // This content is separate from the website cards themselves.
  //
  // WHY?
  // - easier CMS editing
  // - cleaner separation of concerns
  // - reusable intro area
  // - website cards remain independently managed
  // -----------------------------------------------------------------------------
  const [portfolioContent, setPortfolioContent] = useState({
    paragraphs: [],
    link: '/contact',
    linkText: 'Contact for Quote',
  });

  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState('');

  // -----------------------------------------------------------------------------
  // Dynamic Website List State
  // -----------------------------------------------------------------------------
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

  // -----------------------------------------------------------------------------
  // Lesson 14:
  // Fetch dynamic portfolio intro content
  //
  // Powered by:
  // • portfolioContentModel
  // • portfolioContentRoutes
  //
  // This controls:
  // • intro paragraphs
  // • CTA button
  // • CTA link
  // -----------------------------------------------------------------------------
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
          setContentError(data.message || 'Failed to load portfolio content');
        }
      } catch (err) {
        setContentError(err.message || 'Network error fetching content');
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  // -----------------------------------------------------------------------------
  // Lesson 14:
  // Fetch dynamic website portfolio items
  //
  // Powered by:
  // • websiteModel
  // • websiteRoutes
  //
  // Pagination support included.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        const res = await fetch(`${API_BASE}/api/websites/search?page=${page}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch websites');
        }

        if (!ignore) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              websites: data.websites || [],
              page: data.page,
              pages: data.pages,
              countWebsites: data.countWebsites || 0,
            },
          });
        }
      } catch (err) {
        if (!ignore) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: err.message,
          });
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [page]);

  // -----------------------------------------------------------------------------
  // Pagination helper
  // -----------------------------------------------------------------------------
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;

    return {
      pathname: '/portfolio',
      search: `?page=${filterPage}`,
    };
  };

  // -----------------------------------------------------------------------------
  // Update page number in URL
  // -----------------------------------------------------------------------------
  const goToPage = (p) => {
    setSearchParams({ page: String(p) });
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox
  //
  // This page intentionally uses TWO loading systems:
  //
  // 1. portfolioContent loading
  //    → top editable CMS content
  //
  // 2. website loading
  //    → dynamic website portfolio cards
  //
  // Keeping them separate allows:
  // • smoother rendering
  // • cleaner user experience
  // • easier future skeleton upgrades
  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // Render UI
  // -----------------------------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Portfolio</title>
      </Helmet>

      <br />

      {/* ------------------------------------------------------------------ */}
      {/* Lesson 14: Dynamic Portfolio Intro Content */}
      {/* ------------------------------------------------------------------ */}
      <div className='box'>
        {contentLoading ? (
          <LoadingBox size='sm' />
        ) : contentError ? (
          <MessageBox variant='danger'>{contentError}</MessageBox>
        ) : (
          <>
            {portfolioContent.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* Optional CTA Button */}
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

      {/* ------------------------------------------------------------------ */}
      {/* Dynamic Website Portfolio Cards */}
      {/* ------------------------------------------------------------------ */}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          {/* Empty State */}
          {websites.length === 0 && <MessageBox>No Website Found</MessageBox>}

          {/* Website Grid */}
          <div className='row g-3'>
            {websites.map((website) => (
              <div className='col-12 box' key={website._id || website.name}>
                {/* Lesson 14:
                    WebsiteCard reused for dynamic portfolio rendering
                */}
                <WebsiteCard website={website} />
              </div>
            ))}
          </div>

          {/* Pagination */}
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
