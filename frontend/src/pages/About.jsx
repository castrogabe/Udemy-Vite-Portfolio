// -----------------------------------------------------------------------------
// About.jsx — Lesson 12
// -----------------------------------------------------------------------------
// This is the fully dynamic AboutUs page. Content is now loaded from the database
// through /api/aboutcontent and controlled entirely from the admin editor.
//
// Lesson 12 adds:
// • Dynamic Jumbotron image
// • Dynamic multi-section AboutUs layout
// • Special two-column layout for the FIRST section (text + certificate image)
// • SectionImages component to display images for remaining sections
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import SectionImages from '../components/SectionImages';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function AboutUs() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Load About content (GET /api/aboutcontent)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/aboutcontent`);
        if (!res.ok) throw new Error('Failed to fetch about content');
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) return <LoadingBox />;

  // Defensive render if nothing is returned from backend
  if (!content) {
    return (
      <>
        <Helmet>
          <title>About Us</title>
        </Helmet>
        <div className='content'>
          <p>Content not found.</p>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Lesson 12 Layout Logic:
  // The FIRST section is displayed as a special two-column layout:
  //   Left  = text
  //   Right = the FIRST image (often a certificate or portrait)
  //
  // All other sections render normally below.
  // ---------------------------------------------------------------------------
  const sections = Array.isArray(content.sections) ? content.sections : [];
  const firstSection = sections[0];
  const firstSectionImage = firstSection?.images?.[0]; // Only FIRST image is used in the 2-column layout
  const remainingSections = sections.slice(1);

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox
  //
  // This page loads all AboutUs content asynchronously from the database.
  //
  // Why do we wait?
  // - The entire page layout (sections, images, jumbotron) depends on API data
  // - Rendering before the data arrives would cause missing content or layout jumps
  //
  // LoadingBox prevents the page from rendering until the About content
  // has fully loaded from the backend.
  //
  // In later lessons, this can be replaced with Skeleton components,
  // but the conditional rendering logic remains the same.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>

      {/* Optional: Full-width jumbotron image */}
      {content.jumbotronImage?.url && (
        <div className='box'>
          <img
            src={content.jumbotronImage.url}
            alt={content.jumbotronImage.name || 'Jumbotron'}
            className='img-fluid'
          />
        </div>
      )}

      <div className='content'>
        {/* ---------------------------------------------------------------------
          FIRST SECTION (special layout)
           --------------------------------------------------------------------- */}
        {firstSection ? (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* TEXT COLUMN */}
              <div className={firstSectionImage ? 'col-md-7' : 'col-md-12'}>
                {firstSection.title && <h2>{firstSection.title}</h2>}
                {firstSection.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {/* Note: Only text appears here. Other images (if any) are ignored for the first section. */}
              </div>

              {/* IMAGE COLUMN (only the FIRST image) */}
              {firstSectionImage && (
                <div className='col-md-5'>
                  <div className='p-3 bg-light border rounded text-center'>
                    <img
                      src={firstSectionImage.url}
                      alt={firstSectionImage.name || 'Certificate'}
                      className='img-fluid'
                      style={{
                        maxHeight: '520px',
                        width: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------------------------
          REMAINING SECTIONS (normal stacked layout)
           --------------------------------------------------------------------- */}
        {remainingSections.map((section, index) => (
          <div className='box' key={index}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs?.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}

            {/* Renders ALL images for each section */}
            <SectionImages images={section.images} />
          </div>
        ))}
      </div>
    </>
  );
}

// If you want to review the commented teaching version of the About.jsx setup, check commit lesson-03.
// lesson-12: Dynamic about page powered by aboutUsContentModel + API
