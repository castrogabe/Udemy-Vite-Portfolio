import { Link } from 'react-router-dom';

export default function AdminPagination({
  currentPage = 1,
  totalPages = 1,
  basePath = '',
  isAdmin = true,
  keyword = '',
  showIfSinglePage = false,
}) {
  const pageNum = Number(currentPage) || 1;
  const total = Math.max(Number(totalPages) || 1, 1);

  if (!showIfSinglePage && total <= 1) return null;
  const resolvePath = () => {
    if (basePath) return basePath;
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
  const mk = (p) => ({ pathname, search: `?page=${p}` });
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const Disabled = ({ children }) => (
    <li className='page-item disabled'>
      <span className='page-link'>{children}</span>
    </li>
  );

  return (
    <nav aria-label='Pagination'>
      <ul className='pagination'>
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

        {pages.map((p) => (
          <li key={p} className={`page-item ${pageNum === p ? 'active' : ''}`}>
            <Link className='page-link' to={mk(p)}>
              {p}
            </Link>
          </li>
        ))}

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
// If you want to review the final commented teaching version of the AdminPagination.jsx setup, check commit lesson-08.
