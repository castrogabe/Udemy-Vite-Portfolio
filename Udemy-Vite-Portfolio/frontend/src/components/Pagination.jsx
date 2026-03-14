// src/components/Pagination.jsx
// -------------------------------------------------------------
// Lesson 3:
// This reusable component generates page navigation links
// for paginated data such as portfolio items, products, or users.
//
// It receives the current page, total number of pages,
// and a helper function that builds the correct URL
// for each page link.
// -------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  getFilterUrl,
}) {
  // -------------------------------------------------------------
  // Create an array of page numbers
  // Example: totalPages = 5 → [1, 2, 3, 4, 5]
  // -------------------------------------------------------------
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    // Navigation container for accessibility
    <nav aria-label='Portfolio pagination'>
      <ul className='pagination'>
        {/* Loop through each page number and create a link */}
        {pages.map((p) => {
          // Check if this page is the currently active page
          const isActive = Number(currentPage) === p;

          // Generate the URL for this page using the helper function
          const to = getFilterUrl({ page: p });

          return (
            <li key={p} className={`page-item ${isActive ? 'active' : ''}`}>
              {/* 
                React Router Link allows client-side navigation
                without refreshing the page
              */}
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
