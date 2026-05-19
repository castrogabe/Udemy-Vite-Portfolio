import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import SectionImages from '../components/SectionImages';
import useDelayedLoading from '../hooks/useDelayedLoading';
import { SkeletonBase } from '../components/skeletons';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function Design() {
  const [content, setContent] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  // Custom hook for smooth skeleton timing
  const loading = useDelayedLoading(fetchDone, 2000);

  // Fetch data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/designcontent`);
        if (!res.ok) throw new Error('Failed to fetch design content');
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load design content', { autoClose: 2000 });
      } finally {
        setFetchDone(true);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <SkeletonBase />;

  if (!content) {
    return (
      <>
        <Helmet>
          <title>Design</title>
        </Helmet>
        <div className='content'>
          <div className='box'>
            <p>Content not found.</p>
          </div>
        </div>
      </>
    );
  }

  const sections = Array.isArray(content.sections) ? content.sections : [];
  const firstSection = sections[0];
  const firstSectionImage = firstSection?.images?.[0];
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
        {/* Split layout for the first section */}
        {firstSection && (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* Text Column */}
              <div className={firstSectionImage ? 'col-md-7' : 'col-md-12'}>
                {firstSection.title && <h2>{firstSection.title}</h2>}
                {firstSection.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Image Column */}
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
        )}

        {/* Remaining sections */}
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
// lesson-15 Skeletons
