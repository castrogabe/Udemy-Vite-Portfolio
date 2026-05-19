import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import MessageBox from '../../components/MessageBox.jsx';
import { toast } from 'react-toastify';
import { SkeletonForm } from '../../components/skeletons';
import useDelayedLoading from '../../hooks/useDelayedLoading';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function PortfolioEdit() {
  // 1. SIMPLIFIED STATE to match the backend model
  const [content, setContent] = useState({
    paragraphs: [],
    link: '',
    linkText: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [error, setError] = useState(null);

  const [fetchDone, setFetchDone] = useState(false);
  const loading = useDelayedLoading(fetchDone, 2000);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/portfoliocontent`, {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : {},
        });
        const data = await res.json();

        if (res.ok) {
          setContent({
            paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : [],
            link: data.link || '',
            linkText: data.linkText || '',
          });
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch content');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to load content');
        toast.error('Failed to load content', { autoClose: 1000 });
      } finally {
        setFetchDone(true); // ✅ Important for skeleton timing
      }
    };
    fetchContent();
  }, [userInfo]);

  // --- Handlers for Paragraphs and Fields ---

  // Update a single paragraph's text
  const handleParagraphChange = (paragraphIndex, e) => {
    const newParagraphs = [...content.paragraphs];
    newParagraphs[paragraphIndex] = e.target.value;
    setContent({ ...content, paragraphs: newParagraphs });
  };

  // Add a new paragraph
  const handleAddParagraph = () => {
    setContent((prevContent) => ({
      ...prevContent,
      paragraphs: [...prevContent.paragraphs, ''],
    }));
  };

  // Delete a paragraph
  const handleDeleteParagraph = (paragraphIndex) => {
    const newParagraphs = [...content.paragraphs];
    newParagraphs.splice(paragraphIndex, 1);
    setContent({ ...content, paragraphs: newParagraphs });
  };

  // Generic handler for link and linkText fields
  const handleFieldChange = (field, value) => {
    setContent({ ...content, [field]: value });
  };

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/portfoliocontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        // 3. Send the simple, flat content structure
        body: JSON.stringify({
          paragraphs: content.paragraphs,
          link: content.link,
          linkText: content.linkText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update content');
      }

      // Update state with confirmed data from the backend
      setContent({
        paragraphs: data.content.paragraphs,
        link: data.content.link,
        linkText: data.content.linkText,
      });
      toast.success('Content updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update content', {
        autoClose: 1000,
      });
    }
  };

  if (loading) return <SkeletonForm />;

  if (error) {
    return <MessageBox variant='danger'>{error}</MessageBox>;
  }

  // --- Render ---

  return (
    <div className='content'>
      <Helmet>
        <title>Portfolio Edit</title>
      </Helmet>
      <br />
      <h1 className='box'>Portfolio Edit</h1>
      <form onSubmit={handleSubmit}>
        {/* Portfolio Text Content */}
        <div className='mb-4 p-3 border rounded'>
          <h2 className='h4'>Main Portfolio Page Text</h2>

          {/* Dynamic Paragraphs */}
          {content.paragraphs.map((paragraph, paragraphIndex) => (
            <div key={paragraphIndex} className='mb-3'>
              <label
                htmlFor={`formParagraph${paragraphIndex}`}
                className='form-label'
              >
                Paragraph {paragraphIndex + 1}
              </label>
              <textarea
                className='form-control'
                rows={3}
                value={paragraph}
                onChange={(e) => handleParagraphChange(paragraphIndex, e)}
              />
              <button
                type='button'
                className='btn btn-danger mt-2'
                onClick={() => handleDeleteParagraph(paragraphIndex)}
              >
                Delete Paragraph
              </button>
            </div>
          ))}
          <button
            type='button'
            className='btn btn-secondary mt-2 me-2'
            onClick={handleAddParagraph}
          >
            Add Paragraph
          </button>

          <hr className='my-4' />

          <h2 className='h4'>Call-to-Action Button</h2>

          {/* Button Text Input */}
          <div className='mb-3'>
            <label className='form-label'>Button Text (Optional)</label>
            <input
              type='text'
              className='form-control'
              value={content.linkText || ''}
              onChange={(e) => handleFieldChange('linkText', e.target.value)}
            />
          </div>

          {/* Button Link Input */}
          <div className='mb-3'>
            <label className='form-label'>Button Link (Optional)</label>
            <input
              type='text'
              className='form-control'
              value={content.link || ''}
              onChange={(e) => handleFieldChange('link', e.target.value)}
            />
          </div>
        </div>

        <button type='submit' className='btn btn-primary mt-2'>
          Save Changes
        </button>
      </form>
      <br />
    </div>
  );
}

// If you want to review the commented teaching version of the PortfolioEdit.jsx setup, check commit lesson-14.
// lesson-15 Skeletons
