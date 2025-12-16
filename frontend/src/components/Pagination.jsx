// src/components/Pagination.jsx
// -------------------------------------------------------------
// Reusable pagination component for navigating between pages
// of website listings (or any paginated data).
//
// Props:
//   - currentPage:   the currently active page number
//   - totalPages:    total number of available pages
//   - getFilterUrl:  helper function that builds URLs for each page link
//
// This component uses Bootstrap's pagination classes
// and React Router's <Link> for client-side navigation.
// -------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  getFilterUrl,
}) {
  // Create an array like [1, 2, 3, ..., totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label='Portfolio pagination'>
      <ul className='pagination'>
        {pages.map((p) => {
          const isActive = Number(currentPage) === p; // Highlight current page
          const to = getFilterUrl({ page: p }); // Build route for this page
          return (
            <li key={p} className={`page-item ${isActive ? 'active' : ''}`}>
              <Link className='page-link' to={to}>
                {p}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
