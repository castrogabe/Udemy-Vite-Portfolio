// src/components/Header.jsx
// -------------------------------------------------------------
// Lesson 3:
// This component renders the main navigation bar for the site.
// It includes:
//
// • Main navigation links (About, Portfolio, Web Design)
// • User authentication menu (Sign In / Profile / Sign Out)
// • Admin dropdown menu (visible only to admin users)
//
// The component also demonstrates:
//
// • React Router navigation (NavLink / Link)
// • Conditional rendering based on user login status
// • Reading authentication data from localStorage
// • Using Bootstrap navbar and dropdown menus
// -------------------------------------------------------------

import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Header({ userInfo: propUser }) {
  // -------------------------------------------------------------
  // Determine the current logged-in user
  //
  // If userInfo is passed as a prop, use it.
  // Otherwise attempt to read it from localStorage.
  // This allows the navbar to still function if the prop
  // was not provided by a parent component.
  // -------------------------------------------------------------
  const userInfo =
    propUser ?? JSON.parse(localStorage.getItem('userInfo') || 'null');

  // React Router hook used for programmatic navigation
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // Helper function for NavLink styling
  //
  // NavLink automatically provides an "isActive" value
  // allowing us to highlight the currently active page.
  // -------------------------------------------------------------
  const navLink = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  // -------------------------------------------------------------
  // Sign Out Handler
  //
  // Removes the user session from localStorage and
  // redirects the user to the Sign In page.
  // -------------------------------------------------------------
  const signoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  return (
    <header>
      {/* -------------------------------------------------------------
          Bootstrap Navbar
          ------------------------------------------------------------- */}
      <nav className='navbar navbar-expand-lg header' data-bs-theme='dark'>
        <div className='container-fluid px-3'>
          {/* -------------------------------------------------------------
              Brand / Home Link
          ------------------------------------------------------------- */}
          <NavLink to='/' className='navbar-brand'>
            <i className='fas fa-home' aria-hidden='true' /> My Portfolio
          </NavLink>

          {/* -------------------------------------------------------------
              Mobile Navbar Toggle Button
              Appears on small screens to collapse/expand menu
          ------------------------------------------------------------- */}
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

          {/* -------------------------------------------------------------
              Navbar Menu
          ------------------------------------------------------------- */}
          <div className='collapse navbar-collapse' id='mainNavbar'>
            <ul className='navbar-nav ms-auto align-items-lg-center'>
              {/* -------------------------------------------------------------
                  Standard Navigation Links
              ------------------------------------------------------------- */}
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

              {/* -------------------------------------------------------------
                  Authentication Menu
                  Shows different options depending on login state
              ------------------------------------------------------------- */}
              {userInfo ? (
                // Logged-in user dropdown
                <li className='nav-item dropdown'>
                  <button
                    className='nav-link dropdown-toggle'
                    id='userDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    type='button'
                  >
                    {/* Display user's name */}
                    {userInfo.name}
                  </button>

                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='userDropdown'
                  >
                    <li>
                      <Link className='dropdown-item' to='/profile'>
                        User Profile
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
                // If user is NOT logged in
                <li className='nav-item'>
                  <NavLink to='/signin' className={navLink}>
                    <i className='fas fa-sign-in-alt' aria-hidden='true' /> Sign
                    In
                  </NavLink>
                </li>
              )}

              {/* -------------------------------------------------------------
                  Admin Menu
                  Only visible if the user is an admin
              ------------------------------------------------------------- */}
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
                      <Link
                        className='dropdown-item'
                        to='/admin/portfolio-items'
                      >
                        Portfolio Items
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
