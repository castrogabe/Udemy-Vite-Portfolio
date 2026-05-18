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

  const sections = Array.isArray(content.sections) ? content.sections : [];
  const firstSection = sections[0];
  const firstSectionImage = firstSection?.images?.[0]; // only the 1st image is displayed in the top split layout
  const remainingSections = sections.slice(1);

  return (
    <>
      <Helmet>
        <title>Design</title>
      </Helmet>

      {/* Optional Jumbotron Image */}
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
        {/* Split layout: First section text on the left, first image on the right */}
        {firstSection ? (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* Text Column (Left) */}
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

              {/* Certificate/Image Column (Right) - Use firstSectionImage data here */}
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

        {remainingSections.map((section, index) => (
          <div className='box' key={index}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {section.link && section.linkText && (
              <a href={section.link} className='my-button'>
                {section.linkText}
              </a>
            )}

            <SectionImages images={section.images} />
          </div>
        ))}
      </div>
    </>
  );
}

// If you want to review the commented teaching version of the Design.jsx setup, check commit lesson-04.
// lesson-13: Dynamic design page powered by designContentModel + API
