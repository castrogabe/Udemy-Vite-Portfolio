// -----------------------------------------------------------------------------
// AdminPagination.jsx — Lesson 8 (Enhanced Pagination Controls)
// -----------------------------------------------------------------------------
//
// This upgraded pagination component adds full navigation controls:
//
//     «  First page
//     ‹  Previous page
//     1  2  3  4  ← numbered pages
//     ›  Next page
//     »  Last page
//
// 🔥 New in Lesson 8
// -----------------------------------------------------------------------------
//   • `showIfSinglePage` prop — optionally show pagination even if only 1 page.
//   • Full boundary controls (First, Prev, Next, Last).
//   • Disabled state for non-clickable buttons.
//   • Cleaner link-builder function.
//   • Continues to support Lesson 8's `basePath` and legacy `keyword` mapping.
//
// Usage (recommended):
//     <AdminPagination
//        currentPage={page}
//        totalPages={pages}
//        basePath="/admin/users"
//     />
//
// This generates routes like:
//     /admin/users?page=1
//     /admin/users?page=2
//     /admin/users?page=3
//
// -----------------------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function AdminPagination({
  currentPage = 1,
  totalPages = 1,

  // Lesson 8 preferred way: explicit base route
  basePath = '',

  // Legacy mapping fallback
  isAdmin = true,
  keyword = '',

  // Lesson 9: force show even when only 1 page
  showIfSinglePage = false,
}) {
  // Normalize incoming values
  const pageNum = Number(currentPage) || 1;
  const total = Math.max(Number(totalPages) || 1, 1);

  // Hide pagination when only 1 page unless caller forces it
  if (!showIfSinglePage && total <= 1) return null;

  // ---------------------------------------------------------------------------
  // resolvePath() — determines the base of the URL for pagination links
  // Priority:
  //   1) basePath (Lesson 8+ recommended)
  //   2) legacy keyword mapping (for older screens)
  // ---------------------------------------------------------------------------
  const resolvePath = () => {
    // Preferred explicit path provided by parent
    if (basePath) return basePath;

    // Legacy fallback mode
    if (isAdmin) {
      switch (keyword) {
        case 'UserList':
          return '/admin/users';
        case 'Messages':
          return '/admin/messages';
        case 'WebsiteList':
        default:
          return '/admin/websites';
      }
    } else {
      // Non-admin versions (rarely used in portfolio app)
      switch (keyword) {
        case 'UserList':
          return '/users';
        case 'Messages':
          return '/messages';
        case 'WebsiteList':
          return '/websites';
        default:
          return '/';
      }
    }
  };

  const pathname = resolvePath();

  // Helper to construct pagination links
  const mk = (p) => ({ pathname, search: `?page=${p}` });

  // Build numbered page array: [1,2,3,...]
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  // Reusable disabled button component
  const Disabled = ({ children }) => (
    <li className='page-item disabled'>
      <span className='page-link'>{children}</span>
    </li>
  );

  // ---------------------------------------------------------------------------
  // Render Pagination UI
  // ---------------------------------------------------------------------------
  return (
    <nav aria-label='Pagination'>
      <ul className='pagination'>
        {/* --------------------- FIRST + PREVIOUS --------------------- */}
        {pageNum > 1 ? (
          <>
            <li className='page-item'>
              <Link className='page-link' to={mk(1)} aria-label='First'>
                «
              </Link>
            </li>
            <li className='page-item'>
              <Link
                className='page-link'
                to={mk(pageNum - 1)}
                aria-label='Previous'
              >
                ‹
              </Link>
            </li>
          </>
        ) : (
          <>
            <Disabled>«</Disabled>
            <Disabled>‹</Disabled>
          </>
        )}

        {/* --------------------- NUMBERED PAGES --------------------- */}
        {pages.map((p) => (
          <li key={p} className={`page-item ${pageNum === p ? 'active' : ''}`}>
            <Link className='page-link' to={mk(p)}>
              {p}
            </Link>
          </li>
        ))}

        {/* --------------------- NEXT + LAST --------------------- */}
        {pageNum < total ? (
          <>
            <li className='page-item'>
              <Link
                className='page-link'
                to={mk(pageNum + 1)}
                aria-label='Next'
              >
                ›
              </Link>
            </li>
            <li className='page-item'>
              <Link className='page-link' to={mk(total)} aria-label='Last'>
                »
              </Link>
            </li>
          </>
        ) : (
          <>
            <Disabled>›</Disabled>
            <Disabled>»</Disabled>
          </>
        )}
      </ul>
    </nav>
  );
}

// If you want to review the commented teaching version of the AdminPagination.jsx setup, check commit lesson-06.
// updated lesson-08
