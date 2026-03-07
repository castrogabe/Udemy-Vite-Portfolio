// src/pages/Design.jsx — Lesson 13 (Dynamic Design Page)
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import SectionImages from '../components/SectionImages';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function Design() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lesson 13: Design content now comes from the backend (dynamic)
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/designcontent`);
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
  if (!content) {
    return (
      <>
        <Helmet>
          <title>Design</title>
        </Helmet>
        <div className='content'>
          <p>Content not found.</p>
        </div>
      </>
    );
  }

  // Lesson 13:
  // • sections[] comes from MongoDB
  // • the *first* section gets special 2-column layout with 1 image on the right
  const sections = Array.isArray(content.sections) ? content.sections : [];
  const firstSection = sections[0];
  const firstSectionImage = firstSection?.images?.[0]; // only the 1st image is displayed in the top split layout
  const remainingSections = sections.slice(1);

  // -----------------------------------------------------------------------------
  // NOTE ABOUT LoadingBox
  //
  // This page loads all Design content dynamically from the backend.
  //
  // Why do we wait?
  // - The entire layout (sections, images, buttons, jumbotron) depends on API data
  // - Rendering early would cause missing sections or visible layout shifts
  //
  // LoadingBox ensures the Design page is only rendered
  // AFTER the content has been fully loaded.
  //
  // In later lessons, this can be replaced with Skeleton components,
  // but the conditional rendering logic stays exactly the same.
  // -----------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <>
      <Helmet>
        <title>Design</title>
      </Helmet>

      {/* Lesson 13: Optional jumbotron image is now dynamic */}
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
        {/* First section uses a special two-column layout */}
        {firstSection ? (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* Text Column */}
              <div className={firstSectionImage ? 'col-md-7' : 'col-md-12'}>
                {firstSection.title && <h2>{firstSection.title}</h2>}
                {firstSection.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

                {/* New in Lesson 13: optional button for the FIRST section too */}
                {firstSection.link && firstSection.linkText && (
                  <a href={firstSection.link} className='my-button'>
                    {firstSection.linkText}
                  </a>
                )}
              </div>

              {/* Lesson 13: Right-side feature image */}
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

        {/* Lesson 13:
          Remaining sections show:
          • Title
          • Multiple paragraphs
          • Optional button (link + linkText)
          • All section images (via SectionImages component)
        */}
        {remainingSections.map((section, index) => (
          <div className='box' key={index}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {/* New in Lesson 13: optional button per section */}
            {section.link && section.linkText && (
              <a href={section.link} className='my-button'>
                {section.linkText}
              </a>
            )}

            {/* New in Lesson 13: display ALL images for the section */}
            <SectionImages images={section.images} />
          </div>
        ))}
      </div>
    </>
  );
}

// If you want to review the commented teaching version of the Design.jsx setup, check commit lesson-04.
// lesson-13: Dynamic design page powered by designContentModel + API
