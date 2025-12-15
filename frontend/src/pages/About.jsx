// src/pages/About.jsx
// -------------------------------------------------------------
// This component displays the "About Me" section of the portfolio site.
// It uses Helmet for SEO and Bootstrap grid for responsive layout.
// -------------------------------------------------------------

import { Helmet } from 'react-helmet-async'; // Dynamically set <head> tags (title, meta description)

export default function About() {
  return (
    <>
      {/* -------------------------------------------------------------
        Helmet section:
        Sets the browser tab title and meta description for SEO purposes.
        This improves how search engines and social previews display the page.
      ------------------------------------------------------------- */}
      <Helmet>
        <title>About • Gabriel Castro</title>
        <meta
          name='description'
          content='About John Doe — React/MERN developer focusing on clean, fast web apps.'
        />
      </Helmet>

      {/* -------------------------------------------------------------
        Page Layout:
        Bootstrap’s container centers the content and adds horizontal padding.
        "py-4" adds top and bottom spacing for breathing room.
      ------------------------------------------------------------- */}
      <section className='container py-4'>
        {/* Page Title */}
        <h1 className='h2 mb-4'>About Me</h1>

        {/* -------------------------------------------------------------
          Bootstrap Row:
          - "g-4" adds consistent gutter spacing between columns.
          - "align-items-start" ensures columns align at the top.
        ------------------------------------------------------------- */}
        <div className='row g-4 align-items-start'>
          {/* -------------------------------------------------------------
            Left Column (Text Content):
            col-12: full width on mobile
            col-md-6: half width on medium screens and up
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-6'>
            {/* Each <div> wraps a paragraph to control spacing with "mb-3" */}
            <div className='mb-3'>
              <p>
                [Your Name], a graduate from [Your School], builds web
                applications with modern JavaScript tooling (React, Node) and
                database tech (SQL, MongoDB, AWS). I enjoy creating fast,
                accessible UIs and data-driven features.
              </p>
            </div>

            <div className='mb-3'>
              <p>
                Skills include HTML5, CSS3, JavaScript, PHP, MySQL, and SEO best
                practices to help clients get found on the web.
              </p>
            </div>

            <div className='mb-3'>
              <p>
                I run a small, home-based web studio in [Your Area]. Whether you
                need a new site, feature upgrades, or a WordPress build, I can
                help—no job too big or small.
              </p>
            </div>

            <div className='mb-3'>
              <p>
                I work with clients in [Your Area] and remotely anywhere with an
                internet connection.
              </p>
            </div>

            <div className='mb-0'>
              <p>
                For a consultation or quote, reach out via the contact link
                above. I design, code, and host your site—and keep you in the
                loop at every step.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------
            Right Column (Image):
            Displays a photo or certificate with responsive scaling.
            - img-fluid: makes the image responsive
            - rounded: adds rounded corners
            - shadow-sm: adds a light drop shadow
            - loading='lazy': defers loading until the image is visible
          ------------------------------------------------------------- */}
          <div className='col-12 col-md-6'>
            <img
              src='/images/certificate.png' // make sure this image exists in /public/images/
              alt='Certification for [Your Name]'
              className='img-fluid rounded shadow-sm'
              loading='lazy'
            />
          </div>
        </div>
      </section>
    </>
  );
}
