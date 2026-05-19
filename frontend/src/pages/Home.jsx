import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Jumbotron from '../components/Jumbotron';
import { toast } from 'react-toastify';
import useDelayedLoading from '../hooks/useDelayedLoading';
import { SkeletonBase } from '../components/skeletons';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  // Custom hook — ensures skeleton stays up for at least 2s
  const loading = useDelayedLoading(fetchDone, 2000);

  useEffect(() => {
    const ac = new AbortController();

    const fetchHomeContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/homecontent`, {
          signal: ac.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHomeContent(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch home content:', err);
          toast.error('Failed to load content. Please try again later.', {
            autoClose: 2000,
          });
          setHomeContent({
            jumbotronText: ['Error loading...'],
            sections: [{ title: 'Error', content: 'Failed to load content.' }],
          });
        }
      } finally {
        setFetchDone(true);
      }
    };

    fetchHomeContent();
    return () => ac.abort();
  }, []);

  if (loading) return <SkeletonBase />;

  if (!homeContent) {
    return (
      <>
        <Helmet>
          <title>Portfolio Home</title>
        </Helmet>
        <div className='content'>
          <div className='box'>
            <p>Content not available.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Portfolio Home</title>
      </Helmet>

      {/* Hero / Jumbotron */}
      <Jumbotron text={homeContent.jumbotronText} />

      <br />

      {/* Page content sections */}
      <div className='content'>
        {homeContent.sections.map((section, index) => (
          <div className='box' key={index}>
            {section.title && <h4>{section.title}</h4>}
            {section.content && <p>{section.content}</p>}
            {section.link && section.linkText && (
              <a href={section.link} className='my-button'>
                {section.linkText}
              </a>
            )}
          </div>
        ))}
      </div>
      <br />
    </>
  );
}

// If you want to review the commented teaching version of the Contact.jsx setup, check commit lesson-03.
// lesson-11: Dynamic homepage powered by homeContentModel + API
// lesson-15 Skeletons
