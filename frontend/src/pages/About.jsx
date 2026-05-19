import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import SectionImages from '../components/SectionImages';
import useDelayedLoading from '../hooks/useDelayedLoading';
import { SkeletonBase } from '../components/skeletons';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function AboutUs() {
  const [content, setContent] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  // ✅ Use shared hook for unified skeleton timing
  const isLoading = useDelayedLoading(fetchDone, 2000);

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
        setFetchDone(true);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) return <SkeletonBase />;

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
  const firstSectionImage = firstSection?.images?.[0];
  const remainingSections = sections.slice(1);

  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>

      {/* Optional Jumbotron Image */}
      {content.jumbotronImage?.url && (
        <div className='box mb-4'>
          <img
            src={content.jumbotronImage.url}
            alt={content.jumbotronImage.name || 'Jumbotron'}
            className='img-fluid'
          />
        </div>
      )}

      <div className='content'>
        {/* First section - text + optional image */}
        {firstSection && (
          <div className='box'>
            <div className='row g-4 align-items-start'>
              {/* Text column */}
              <div className={firstSectionImage ? 'col-md-7' : 'col-md-12'}>
                {firstSection.title && <h2>{firstSection.title}</h2>}
                {firstSection.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Image column */}
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
        {remainingSections.map((section, idx) => (
          <div className='box' key={idx}>
            {section.title && <h2>{section.title}</h2>}
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
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
// lesson-15 Skeletons
