// src/pages/About.jsx
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About • Gabriel Castro</title>
        <meta
          name='description'
          content='About Gabriel Castro — React/MERN developer focusing on clean, fast web apps.'
        />
      </Helmet>

      <section className='container py-4'>
        <h1 className='box h2 mb-4'>About Me</h1>
        <br />
        <div className='row g-4 align-items-start'>
          <div className='box col-12 col-md-6'>
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

          <div className='col-12 col-md-6'>
            <img
              src='/images/certificate.png' // place file at public/images/cert.png
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

// If you want to review the commented teaching version of the About.jsx setup, check commit lesson-03.
