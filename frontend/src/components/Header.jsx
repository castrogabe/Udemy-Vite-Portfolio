// NEW: useLocation added to preserve redirect target after login lesson 6
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';

export default function Header() {
  // NEW: using Store context instead of propUser for global state
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
              {/* UPDATED: "About Us" is now a dropdown with multiple internal links */}
              {/* lesson 4 */}
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

              {/* UPDATED: route renamed from '/design' → '/webdesign' */}
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
                // lesson 6
                <li className='nav-item'>
                  <NavLink to={signInHref} className={navLink}>
                    <i className='fas fa-sign-in-alt' aria-hidden='true' /> Sign
                    In
                  </NavLink>
                </li>
              )}

              {/* Admin menu */}
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

                    {/* lesson 6 */}
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

// If you want to review the commented teaching version of the Header.jsx setup, check commit lesson-04.

// Lesson 6 updates summary:
// • Replaced prop-based userInfo with Context from Store
// • Added redirect-aware sign-in links
// • Converted “About Us” link into a dropdown
// • Changed /design → /webdesign
// • Using Contact/Messages
