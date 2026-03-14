// src/components/Footer.jsx
// -------------------------------------------------------------
// Lesson 3:
// This component renders the website footer.
// It contains three sections:
//
// • Social media links (external links)
// • Internal navigation links
// • Contact / support links
//
// The footer uses Bootstrap grid columns to create a responsive
// layout that stacks vertically on small screens and displays
// side-by-side on larger screens.
// -------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // Main footer container
    <footer className='footer'>
      <div className='container-fluid px-3'>
        {/* Bootstrap grid row */}
        <div className='row gy-4'>
          {/* -------------------------------------------------------------
              Column 1: Social Media Links
              External links use <a> instead of React Router <Link>
              because they navigate outside the React application.
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-4'>
            <h6 className='text-uppercase fw-bold mb-2'>Stay in touch</h6>

            <ul className='list-unstyled m-0'>
              <li className='mb-1'>
                <a
                  href='https://www.facebook.com/'
                  className='socialIcon facebookIcon d-inline-flex align-items-center gap-2'
                  target='_blank' // Opens link in a new tab
                  rel='noopener noreferrer' // Security best practice
                  aria-label='Facebook'
                >
                  Facebook
                </a>
              </li>

              <li className='mb-1'>
                <a
                  href='https://www.instagram.com/channel/'
                  className='socialIcon youtubeIcon d-inline-flex align-items-center gap-2'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Instagram'
                >
                  Instagram
                </a>
              </li>

              <li className='mb-1'>
                <a
                  href='https://x.com/channel'
                  className='socialIcon d-inline-flex align-items-center gap-2'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='X (Twitter)'
                >
                  X
                </a>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              Column 2: Internal Navigation Links
              These use React Router <Link> because the navigation
              stays inside the React application.
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-4'>
            <h6 className='text-uppercase fw-bold mb-2'>Get To Know Us</h6>

            <ul className='list-unstyled m-0'>
              <li className='mb-1'>
                <Link
                  to='/about'
                  className='email d-inline-flex align-items-center gap-2'
                >
                  About Us
                </Link>
              </li>

              <li className='mb-1'>
                <Link
                  to='/'
                  className='email d-inline-flex align-items-center gap-2'
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* -------------------------------------------------------------
              Column 3: Help / Contact Links
              Provides quick access to support pages.
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-4'>
            <h6 className='text-uppercase fw-bold mb-2'>Questions</h6>

            <ul className='list-unstyled m-0'>
              <li className='mb-1'>
                <Link
                  to='/contact'
                  className='email d-inline-flex align-items-center gap-2'
                >
                  Contact Us
                </Link>
              </li>

              <li className='mb-1'>
                <Link
                  to='/faq'
                  className='email d-inline-flex align-items-center gap-2'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
