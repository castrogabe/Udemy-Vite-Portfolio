// src/components/Header.jsx
import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Header({ userInfo: propUser }) {
  // Optional: read from localStorage if no prop is passed
  const userInfo =
    propUser ?? JSON.parse(localStorage.getItem('userInfo') || 'null');
  const navigate = useNavigate();

  const navLink = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  const signoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

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
            <ul className='navbar-nav ms-auto align-items-lg-center'>
              {/* Regular links */}
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

              {/* Auth menu added later*/}
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
                <li className='nav-item'>
                  <NavLink to='/signin' className={navLink}>
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
