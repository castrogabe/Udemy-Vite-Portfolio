import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import SectionImages from '../components/SectionImages';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function AboutUs() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const sections = Array.isArray(content.sections) ? content.sections : [];
  const firstSection = sections[0];
  const firstSectionImage = firstSection?.images?.[0]; // Only FIRST image is used in the 2-column layout
  const remainingFirstSectionImages = firstSection?.images?.slice(1) || [];
  const remainingSections = sections.slice(1);

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
        {firstSection ? (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* TEXT COLUMN */}
              <div className={firstSectionImage ? 'col-md-7' : 'col-md-12'}>
                {firstSection.title && <h2>{firstSection.title}</h2>}
                {firstSection.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

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

            {remainingFirstSectionImages.length > 0 && (
              <div className='mt-4'>
                <SectionImages images={remainingFirstSectionImages} />
              </div>
            )}
          </div>
        ) : null}

        {remainingSections.map((section, index) => (
          <div className='box' key={index}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs?.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}

            <SectionImages images={section.images} />
          </div>
        ))}
      </div>
    </>
  );
}

// If you want to review the commented teaching version of the About.jsx setup, check commit lesson-03.
// lesson-12: Dynamic about page powered by aboutUsContentModel + API
