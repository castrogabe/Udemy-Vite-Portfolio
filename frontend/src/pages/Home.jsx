// -----------------------------------------------------------------------------
// Home.jsx — Lesson 11
// -----------------------------------------------------------------------------
// The homepage now loads **dynamic content from MongoDB**, instead of
// hard-coded text. Admins can update this content using HomeContentEdit.jsx.
//
// What is loaded dynamically:
//   • jumbotronText → array of strings for the typewriter effect
//   • sections → homepage content blocks (title, text, optional button)
//
// Data source:
//   GET /api/homecontent   ← supplied by homeContentRoutes.js (Lesson 11)
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Jumbotron from '../components/Jumbotron';
import { toast } from 'react-toastify';

// Lesson-11: support Vite dev mode + production using optional VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function Home() {
  // Lesson-11: homepage content now comes from the database
  const [homeContent, setHomeContent] = useState({
    jumbotronText: ['Loading...'],
    sections: [],
  });

  // -----------------------------------------------------------------------------
  // Load dynamic homepage content
  // GET /api/homecontent
  // -----------------------------------------------------------------------------
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

        // Populate homepage with dynamic data
        setHomeContent(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch home content:', err);
          toast.error('Failed to load content. Please try again later.');

          // Lesson-11: graceful fallback so the homepage still renders something
          setHomeContent({
            jumbotronText: ['Error loading...'],
            sections: [{ title: 'Error', content: 'Failed to load content.' }],
          });
        }
      }
    };

    fetchHomeContent();

    // Abort fetch if the component unmounts
    return () => ac.abort();
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio Home</title>
      </Helmet>

      {/* Lesson-11: Jumbotron now receives dynamic Typewriter text */}
      <Jumbotron text={homeContent.jumbotronText} />

      <br />

      {/* Lesson-11: Render dynamic homepage sections */}
      <div className='content'>
        {homeContent.sections.map((section, index) => (
          <div className='box' key={index}>
            <h4>{section.title}</h4>
            <p>{section.content}</p>

            {/* Optional button (added in Lesson 11 schema) */}
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
