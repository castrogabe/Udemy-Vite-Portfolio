import { Link } from 'react-router-dom';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  getFilterUrl,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label='Portfolio pagination'>
      <ul className='pagination'>
        {pages.map((p) => {
          const isActive = Number(currentPage) === p;
          const to = getFilterUrl({ page: p });
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
