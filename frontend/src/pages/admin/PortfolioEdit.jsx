import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function PortfolioEdit() {
  /**
   * Lesson 14:
   * The Portfolio page is intentionally SIMPLE —
   * no images, no sections, no arrays of objects.
   *
   * Flat structure:
   *   - paragraphs[]  → main text blocks
   *   - link          → optional CTA button URL
   *   - linkText      → optional CTA button label
   *
   * This matches the PortfolioContent model.
   */
  const [content, setContent] = useState({
    paragraphs: [],
    link: '',
    linkText: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------
  // FETCH the Portfolio content document
  // Uses the same pattern as About/Design, but with flat data
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/portfoliocontent`, {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : {},
        });

        const data = await res.json();

        if (res.ok) {
          // Ensure safe defaults
          setContent({
            paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : [],
            link: data.link || '',
            linkText: data.linkText || '',
          });
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch content');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load content');
        toast.error('Failed to load content', { autoClose: 1000 });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [userInfo]);

  // -----------------------------
  // PARAGRAPH HANDLERS (Dynamic)
  // -----------------------------
  const handleParagraphChange = (paragraphIndex, e) => {
    const newParagraphs = [...content.paragraphs];
    newParagraphs[paragraphIndex] = e.target.value;
    setContent({ ...content, paragraphs: newParagraphs });
  };

  const handleAddParagraph = () => {
    setContent((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ''],
    }));
  };

  const handleDeleteParagraph = (paragraphIndex) => {
    const newParagraphs = [...content.paragraphs];
    newParagraphs.splice(paragraphIndex, 1);
    setContent({ ...content, paragraphs: newParagraphs });
  };

  // ------------------------------------------------------
  // GENERIC TEXT FIELD HANDLER
  // For: link, linkText (CTA button fields)
  // ------------------------------------------------------
  const handleFieldChange = (field, value) => {
    setContent({ ...content, [field]: value });
  };

  // ------------------------------------------------------
  // SUBMIT updated Portfolio content
  // PUT /api/portfoliocontent
  // ------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/portfoliocontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },

        /**
         * Note for students:
         * Unlike About/Design, we do NOT nest objects.
         * The Portfolio model uses a flat structure.
         */
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

      // Confirm updated values from backend
      setContent({
        paragraphs: data.content.paragraphs,
        link: data.content.link,
        linkText: data.content.linkText,
      });

      toast.success('Content updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update content', { autoClose: 1000 });
    }
  };

  // ----------------------------------------
  // Render fallback states
  // ----------------------------------------
  if (loading) return <LoadingBox />;
  if (error) return <MessageBox variant='danger'>{error}</MessageBox>;

  // ---------------------------------------------------------
  // NOTE ABOUT LoadingBox (IMPORTANT FOR STUDENTS)
  //
  // This admin page MUST wait for data before rendering.
  //
  // Why?
  // - The form is pre-filled with existing Portfolio content
  // - Text areas are controlled inputs tied to backend data
  // - Rendering early would show empty fields
  // - Admins could accidentally overwrite content
  //
  // LoadingBox prevents the form from rendering until
  // the Portfolio content has finished loading.
  //
  // Later lessons may replace this with Skeleton components,
  // but the conditional rendering logic stays the same.
  // ---------------------------------------------------------

  // ----------------------------------------
  // Render UI
  // ----------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>Portfolio Edit</title>
      </Helmet>

      <br />
      <h1 className='box'>Portfolio Edit</h1>

      <form onSubmit={handleSubmit}>
        <div className='mb-4 p-3 border rounded'>
          <h2 className='h4'>Main Portfolio Page Text</h2>

          {/* Lesson 14: simple paragraph array */}
          {content.paragraphs.map((paragraph, index) => (
            <div key={index} className='mb-3'>
              <label className='form-label'>Paragraph {index + 1}</label>

              <textarea
                className='form-control'
                rows={3}
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e)}
              />

              <button
                type='button'
                className='btn btn-danger mt-2'
                onClick={() => handleDeleteParagraph(index)}
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

          {/* CTA Text */}
          <div className='mb-3'>
            <label className='form-label'>Button Text (Optional)</label>
            <input
              type='text'
              className='form-control'
              value={content.linkText}
              onChange={(e) => handleFieldChange('linkText', e.target.value)}
            />
          </div>

          {/* CTA Link */}
          <div className='mb-3'>
            <label className='form-label'>Button Link (Optional)</label>
            <input
              type='text'
              className='form-control'
              value={content.link}
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
