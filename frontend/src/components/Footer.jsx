// src/components/Footer.jsx
// -------------------------------------------------------------
// Footer component with three columns:
// 1️⃣ Social links (external)
// 2️⃣ Internal navigation links (React Router)
// 3️⃣ Quick contact links
//
// This appears on every page above the BottomFooter.
// -------------------------------------------------------------

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='container-fluid px-3'>
        <div className='row gy-4'>
          {/* -----------------------------------------------------
              Column 1: Social Media (external <a> links)
          ------------------------------------------------------ */}
          <div className='col-12 col-md-4'>
            <h6 className='text-uppercase fw-bold mb-2'>Stay in touch</h6>
            <ul className='list-unstyled m-0'>
              <li className='mb-1'>
                <a
                  href='https://www.facebook.com/'
                  className='socialIcon facebookIcon d-inline-flex align-items-center gap-2'
                  target='_blank'
                  rel='noopener noreferrer'
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

          {/* -----------------------------------------------------
              Column 2: Internal Site Links (React Router <Link>)
          ------------------------------------------------------ */}
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

          {/* -----------------------------------------------------
              Column 3: Contact & FAQ Links
          ------------------------------------------------------ */}
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
