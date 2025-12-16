// src/components/Header.jsx
// -------------------------------------------------------------
// Main site header with navigation links, user dropdown,
// and admin menu.
//
// Uses React Router’s NavLink for active link styling,
// Bootstrap for layout, and localStorage to remember user login.
// -------------------------------------------------------------

import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Header({ userInfo: propUser }) {
  // -------------------------------------------------------------
  // 1️⃣ Access user info
  // -------------------------------------------------------------
  // If userInfo is passed as a prop (from Store or parent),
  // use that. Otherwise, fall back to localStorage.
  const userInfo =
    propUser ?? JSON.parse(localStorage.getItem('userInfo') || 'null');

  const navigate = useNavigate();

  // Utility for active NavLink styling
  const navLink = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  // -------------------------------------------------------------
  // 2️⃣ Handle user sign out
  // -------------------------------------------------------------
  // Remove saved user info from localStorage and redirect.
  const signoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  // -------------------------------------------------------------
  // 3️⃣ Render navigation bar
  // -------------------------------------------------------------
  return (
    <header>
      <nav className='navbar navbar-expand-lg header' data-bs-theme='dark'>
        <div className='container-fluid px-3'>
          {/* Brand / Logo */}
          <NavLink to='/' className='navbar-brand'>
            <i className='fas fa-home' aria-hidden='true' /> My Portfolio
          </NavLink>

          {/* Mobile toggle button */}
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#mainNavbar'
            aria-controls='mainNavbar'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>

          {/* Collapsible links */}
          <div className='collapse navbar-collapse' id='mainNavbar'>
            <ul className='navbar-nav ms-auto align-items-lg-center'>
              {/* -------------------------------------------------
                  Public Navigation Links
              -------------------------------------------------- */}
              <li className='nav-item'>
                <NavLink to='/about' className={navLink}>
                  <i className='fas fa-briefcase' aria-hidden='true' /> About Us
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to='/portfolio' className={navLink}>
                  <i className='fas fa-briefcase' aria-hidden='true' />{' '}
                  Portfolio
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to='/design' className={navLink}>
                  <i className='fas fa-layer-group' aria-hidden='true' /> Web
                  Design
                </NavLink>
              </li>

              {/* -------------------------------------------------
                  User Menu (visible when signed in)
              -------------------------------------------------- */}
              {userInfo ? (
                <li className='nav-item dropdown'>
                  <button
                    className='nav-link dropdown-toggle'
                    id='userDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    type='button'
                  >
                    {userInfo.name}
                  </button>
                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='userDropdown'
                  >
                    <li>
                      <Link className='dropdown-item' to='/profile'>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className='dropdown-divider' />
                    </li>
                    <li>
                      <button
                        className='dropdown-item'
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                // -------------------------------------------------
                // Sign-in link for guests
                // -------------------------------------------------
                <li className='nav-item'>
                  <NavLink to='/signin' className={navLink}>
                    <i className='fas fa-sign-in-alt' aria-hidden='true' /> Sign
                    In
                  </NavLink>
                </li>
              )}

              {/* -------------------------------------------------
                  Admin Menu (only visible for admin users)
              -------------------------------------------------- */}
              {userInfo?.isAdmin && (
                <li className='nav-item dropdown'>
                  <button
                    className='nav-link dropdown-toggle'
                    id='adminDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    type='button'
                  >
                    Admin
                  </button>
                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='adminDropdown'
                  >
                    <li>
                      <Link className='dropdown-item' to='/admin/dashboard'>
                        Website Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/admin/users'>
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/admin/websites'>
                        Websites
                      </Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/admin/messages'>
                        Messages
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
