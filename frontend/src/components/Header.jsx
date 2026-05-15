// src/components/Header.jsx
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const location = useLocation();

  const navLink = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  // NEW: Redirect-aware sign-in link
  // send users back to where they started after signin
  const signInHref = `/signin?redirect=${encodeURIComponent(
    location.pathname + location.search
  )}`;

  return (
    <header>
      <nav className='navbar navbar-expand-lg header' data-bs-theme='dark'>
        <div className='container-fluid px-3'>
          {/* Home Dynamic lesson 11 */}
          <NavLink to='/' className='navbar-brand'>
            <i className='fas fa-home' aria-hidden='true' /> My Portfolio
          </NavLink>

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

          <div className='collapse navbar-collapse' id='mainNavbar'>
            <ul className='navbar-nav ms-auto w-100 justify-content-end align-items-lg-center'>
              {/* About Us dropdown */}
              <li className='nav-item dropdown'>
                <button
                  className='nav-link dropdown-toggle'
                  id='aboutDropdown'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                  type='button'
                >
                  About Us
                </button>
                <ul className='dropdown-menu' aria-labelledby='aboutDropdown'>
                  <li>
                    <Link className='dropdown-item' to='/about'>
                      About Us
                    </Link>
                  </li>

                  {/* lesson 6 */}
                  <li>
                    <Link className='dropdown-item' to='/contact'>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </li>

              <li className='nav-item'>
                <NavLink to='/portfolio' className={navLink}>
                  <i className='fas fa-briefcase' aria-hidden='true' />{' '}
                  Portfolio
                </NavLink>
              </li>

              <li className='nav-item'>
                <NavLink to='/webdesign' className={navLink}>
                  <i className='fas fa-layer-group' aria-hidden='true' /> Web
                  Design
                </NavLink>
              </li>
              {/* end lesson 4 */}

              {/* User Menu lesson 6 */}
              {userInfo ? (
                <li className='nav-item dropdown'>
                  <button
                    className='nav-link dropdown-toggle'
                    id='userDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                    type='button'
                  >
                    <i className='fas fa-user-circle me-1'></i>
                    {userInfo.name}
                  </button>
                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='userDropdown'
                  >
                    <li>
                      {/* lesson 7 */}
                      <Link className='dropdown-item' to='/profile'>
                        <i className='fas fa-user me-2'></i> Profile
                      </Link>
                    </li>
                    <li>
                      <hr className='dropdown-divider' />
                    </li>
                    <li>
                      <Link
                        className='dropdown-item text-danger'
                        to='#signout'
                        onClick={signoutHandler}
                      >
                        <i className='fas fa-sign-out-alt me-2'></i> Sign Out
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                // lesson 6
                <li className='nav-item'>
                  <Link className='nav-link' to={signInHref}>
                    <i className='fas fa-sign-in-alt me-2'></i> Sign In
                  </Link>
                </li>
              )}

              {/* Admin menu */}
              {userInfo?.isAdmin && (
                <li className='nav-item dropdown'>
                  <button
                    className='nav-link dropdown-toggle'
                    id='adminDropdown'
                    data-bs-toggle='dropdown'
                    data-bs-auto-close='outside' // keep submenu open while interacting
                    aria-expanded='false'
                    type='button'
                  >
                    Admin
                  </button>

                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='adminDropdown'
                  >
                    {/* lesson 7 */}
                    <li>
                      <Link className='dropdown-item' to='/admin/dashboard'>
                        Website Dashboard
                      </Link>
                    </li>

                    {/* lesson 8 */}
                    <li>
                      <Link className='dropdown-item' to='/admin/users'>
                        Users
                      </Link>
                    </li>

                    {/* lesson 9 */}
                    <li>
                      <Link className='dropdown-item' to='/admin/websites'>
                        Websites
                      </Link>
                    </li>

                    {/* lesson 6 */}
                    <li>
                      <Link className='dropdown-item' to='/admin/messages'>
                        Messages
                      </Link>
                    </li>

                    {/* Edit Pages submenu (green) lesson-11*/}
                    <li className='nav-item dropdown'>
                      <button
                        className='dropdown-item dropdown-toggle text-white bg-success fw-semibold'
                        id='editPagesDropdown'
                        data-bs-toggle='dropdown'
                        aria-expanded='false'
                        type='button'
                      >
                        Edit Pages
                      </button>
                      <ul
                        className='dropdown-menu'
                        aria-labelledby='editPagesDropdown'
                      >
                        {/* lesson 11 */}
                        <li>
                          <Link
                            className='dropdown-item'
                            to='/admin/homecontent'
                          >
                            Home Edit
                          </Link>
                        </li>

                        <li>
                          <Link
                            className='dropdown-item'
                            to='/admin/aboutusedit'
                          >
                            About Edit
                          </Link>
                        </li>

                        <li>
                          <Link
                            className='dropdown-item'
                            to='/admin/designedit'
                          >
                            Design Edit
                          </Link>
                        </li>

                        <li>
                          <Link
                            className='dropdown-item'
                            to='/admin/portfolioedit'
                          >
                            PortfolioEdit
                          </Link>
                        </li>
                      </ul>
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

// If you want to review the commented teaching version of the Header.jsx setup, check commit lesson-04.

// Lesson 6 updates summary:
// • Replaced prop-based userInfo with Context from Store
// • Added redirect-aware sign-in links
// • Converted “About Us” link into a dropdown
// • Changed /design → /webdesign
// • Using Contact/Messages

// lesson-7 using Dashboard/Profile
// lesson-8 users
// lesson-9 websites
// lesson-11 updated with admin Edit Pages submenu (green)
// lesson-11 using the admin/edit HomeEdit page
