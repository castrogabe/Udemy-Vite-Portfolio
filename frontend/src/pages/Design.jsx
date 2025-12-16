// src/pages/Design.jsx
// -------------------------------------------------------------
// This page explains the web design and development services offered.
// It uses Helmet for SEO, Bootstrap grid for layout, and React Router's Link
// for navigation to the Contact page.
// -------------------------------------------------------------

import { Helmet } from 'react-helmet-async'; // For dynamic <title> tag and SEO metadata
import { Link } from 'react-router-dom'; // Enables navigation without page reload

// -------------------------------------------------------------------------
// Render UI
// -------------------------------------------------------------------------
export default function Design() {
  return (
    <>
      {/* -------------------------------------------------------------
        Hero / Banner Section:
        - Displays a full-width image at the top of the page.
        - "keyboard" class can be styled with CSS to add overlay or padding.
      ------------------------------------------------------------- */}
      <div className='keyboard'>
        <img
          id='image'
          src='/images/keyBoard.jpg'
          width='100%'
          alt='Keyboard'
        />
      </div>

      <br />

      {/* -------------------------------------------------------------
        Main Content Section:
        Contains both text and image columns describing services.
      ------------------------------------------------------------- */}
      <div className='content'>
        {/* Helmet dynamically updates page title */}
        <Helmet>
          <title>Web Design</title>
        </Helmet>

        {/* -------------------------------------------------------------
          Bootstrap Row:
          - "g-4" provides gutter spacing between columns.
          - Two-column layout: text on the left, image on the right.
        ------------------------------------------------------------- */}
        <div className='row g-4'>
          {/* -------------------------------------------------------------
            Left Column: Descriptive text and service process steps.
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-6'>
            <div className='box'>
              <h4>Web Design</h4>
              {/* Ordered list: step-by-step explanation of the design process */}
              <ol>
                <li>
                  The process of designing a website: email me to schedule an
                  appointment in [your area]. If a physical appointment is not
                  necessary, we can chat about your vision.
                </li>
                <li>
                  I will produce a written quote based on your vision and the
                  number of revisions.
                </li>
                <li>
                  I will produce a design concept of your website before any
                  coding is done and ensure you are happy with the design.
                </li>
              </ol>
              <hr />{' '}
              {/* Visual separator between design and development sections */}
              <h4>Web Development</h4>
              <p>
                I have programming knowledge in HTML5, CSS3, JavaScript,
                Angular, React, PHP, MySQL, and SEO (Search Engine Optimization)
                to help your clients find you on the web.
              </p>
              {/* Ordered list: key development promises or workflow steps */}
              <ol>
                <li>
                  I will program your website using code that is clean and easy
                  to read.
                </li>
                <li>
                  I test the code in my web browser to ensure everything flows
                  and reads correctly.
                </li>
                <li>
                  I design for mobile devices first, then for desktop, as most
                  transactions are mobile-driven.
                </li>
                <li>
                  I stand behind the code and product that I release to you.
                </li>
                <li>
                  You will receive an email containing all the coding files from
                  your website design.
                </li>
              </ol>
              {/* -------------------------------------------------------------
                Contact Button:
                Uses React Router <Link> to navigate to /contact page.
                The button encourages the user to request a quote.
              ------------------------------------------------------------- */}
              <Link to='/contact'>
                <button className='btn btn-primary mt-3'>
                  Contact for Quote
                </button>
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------------------
            Right Column: Supporting image for visual appeal.
            "text-center" centers the image horizontally.
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-6'>
            <div className='box text-center'>
              <img
                src='/images/design.png'
                alt='Web Design'
                className='img-portfolio img-fluid'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
