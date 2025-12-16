// -------------------------------------------------------------
// AdminPagination.jsx — Reusable Pagination Component
// -------------------------------------------------------------
// This component displays pagination links for admin (or user) lists.
// It’s used in multiple screens: Products, Orders, Users, and Messages.
//
// Concepts covered:
// ✅ Dynamic route generation based on page + role (admin/user)
// ✅ Conditional logic for different list contexts
// ✅ Reusable and consistent pagination UI
// ✅ Accessibility: aria-label for navigation
// -------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function AdminPagination({
  currentPage,
  totalPages,
  isAdmin = true,
  keyword = '',
}) {
  // -----------------------------------------------------------
  // buildPath() dynamically determines which route to use
  // depending on whether this is an admin page or not,
  // and which list type (Products, Orders, Users, Messages)
  // -----------------------------------------------------------
  const buildPath = (page) => {
    let pathname = '/';

    // Products
    if (isAdmin && keyword === '') pathname = '/admin/products';
    else if (!isAdmin && keyword === '') pathname = '/products';
    // Websites
    else if (isAdmin && keyword === 'WebsiteList') pathname = '/admin/websites';
    else if (!isAdmin && keyword === 'WebsiteList') pathname = '/websites';
    // Users
    else if (isAdmin && keyword === 'UserList') pathname = '/admin/users';
    else if (!isAdmin && keyword === 'UserList') pathname = '/users';
    // Messages
    else if (isAdmin && keyword === 'Messages') pathname = '/admin/messages';
    else if (!isAdmin && keyword === 'Messages') pathname = '/messages';

    // Return route object React Router <Link> can use
    return { pathname, search: `?page=${page}` };
  };

  // -----------------------------------------------------------
  // Create an array of page numbers [1, 2, 3, ... totalPages]
  // -----------------------------------------------------------
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // -----------------------------------------------------------
  // Render pagination UI
  // -----------------------------------------------------------
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
