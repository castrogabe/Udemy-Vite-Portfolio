import { Link } from 'react-router-dom';

export default function AdminPagination({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) {
  const buildPath = (page) => {
    let pathname = '/';

    if (isAdmin && keyword === '') pathname = '/admin/products';
    else if (!isAdmin && keyword === '') pathname = '/products';
    else if (isAdmin && keyword === 'WebsiteList') pathname = '/admin/websites';
    else if (!isAdmin && keyword === 'WebsiteList') pathname = '/websites';
    else if (isAdmin && keyword === 'UserList') pathname = '/admin/users';
    else if (!isAdmin && keyword === 'UserList') pathname = '/users';
    else if (isAdmin && keyword === 'Messages') pathname = '/admin/messages';
    else if (!isAdmin && keyword === 'Messages') pathname = '/messages';

    return { pathname, search: `?page=${page}` };
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label='Admin pagination'>
      <ul className='pagination'>
        {pages.map((p) => (
          <li
            key={p}
            className={`page-item ${currentPage === p ? 'active' : ''}`}
          >
            <Link className='page-link' to={buildPath(p)}>
              {p}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// If you want to review the commented teaching version of the AdminPagination.jsx setup, check commit lesson-06.
