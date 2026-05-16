// -----------------------------------------------------------------------------
// AboutUsEdit.jsx — Lesson 12
// -----------------------------------------------------------------------------
// This is the admin page for editing the About Us content.
// In Lesson 12, the About page becomes fully dynamic:
//
// • Upload a Jumbotron image
// • Add/remove sections
// • Add/remove paragraphs inside each section
// • Upload/delete multiple images per section
//
// Everything saves to the AboutContent model via /api/aboutcontent routes.
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function AboutUsEdit() {
  // ---------------------------------------------------------
  // content = { jumbotronImage: {url,name}, sections: [...] }
  // ---------------------------------------------------------
  const [content, setContent] = useState({
    sections: [],
    jumbotronImage: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const { state } = useContext(Store);
  const { userInfo } = state;

  // ---------------------------------------------------------
  // Load About content on page load (GET /api/aboutcontent)
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/aboutcontent`, {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : {},
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch content');
        }

        // Defensive: ensure arrays exist
        setContent({
          sections: Array.isArray(data.sections) ? data.sections : [],
          jumbotronImage: data.jumbotronImage || null,
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load content', { autoClose: 1000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [userInfo]);

  // ---------------------------------------------------------
  // Section Title + Paragraphs (Dynamic updates)
  // ---------------------------------------------------------
  const handleTitleChange = (sectionIndex, e) => {
    const newSections = [...content.sections];
    newSections[sectionIndex].title = e.target.value;
    setContent({ ...content, sections: newSections });
  };

  const handleParagraphChange = (sectionIndex, paragraphIndex, e) => {
    const newSections = [...content.sections];
    newSections[sectionIndex].paragraphs[paragraphIndex] = e.target.value;
    setContent({ ...content, sections: newSections });
  };

  const handleAddParagraph = (sectionIndex) => {
    const newSections = [...content.sections];
    newSections[sectionIndex].paragraphs.push('');
    setContent({ ...content, sections: newSections });
  };

  const handleDeleteParagraph = (sectionIndex, paragraphIndex) => {
    const newSections = [...content.sections];
    newSections[sectionIndex].paragraphs.splice(paragraphIndex, 1);
    setContent({ ...content, sections: newSections });
  };

  // ---------------------------------------------------------
  // Add / Remove whole sections
  // ---------------------------------------------------------
  const handleAddSection = () => {
    setContent((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: '', paragraphs: [''], images: [] }],
    }));
  };

  const handleDeleteSection = (sectionIndex) => {
    const newSections = [...content.sections];
    newSections.splice(sectionIndex, 1);
    setContent({ ...content, sections: newSections });
  };

  // ---------------------------------------------------------
  // Image Upload for each section (PUT /api/aboutcontent/image)
  // ---------------------------------------------------------
  const handleImageUpload = async (sectionIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/api/aboutcontent/image`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to upload image');

      const newSections = [...content.sections];
      newSections[sectionIndex].images.push(data.image);
      setContent({ ...content, sections: newSections });

      toast.success('Image uploaded successfully', { autoClose: 1000 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', { autoClose: 1000 });
    }
  };

  // ---------------------------------------------------------
  // Delete image from a section (DELETE /api/aboutcontent/image)
  // ---------------------------------------------------------
  const handleDeleteImage = async (sectionIndex, imageIndex) => {
    const imageToDelete = content.sections[sectionIndex].images[imageIndex];

    try {
      const res = await fetch(`${API_BASE}/api/aboutcontent/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ imageName: imageToDelete.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete image');

      const newSections = [...content.sections];
      newSections[sectionIndex].images.splice(imageIndex, 1);
      setContent({ ...content, sections: newSections });

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete image');
    }
  };

  // ---------------------------------------------------------
  // Upload / Delete Jumbotron image
  // ---------------------------------------------------------
  const handleJumbotronUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('jumbotronImage', file);

    try {
      const res = await fetch(`${API_BASE}/api/aboutcontent/jumbotron`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to upload jumbotron image');

      setContent({ ...content, jumbotronImage: data.jumbotronImage });

      toast.success('Jumbotron image uploaded successfully', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload jumbotron image', { autoClose: 1000 });
    }
  };

  const handleDeleteJumbotron = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/aboutcontent/jumbotron`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to delete jumbotron image');

      setContent({ ...content, jumbotronImage: null });
      toast.success('Jumbotron image deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete jumbotron image');
    }
  };

  // ---------------------------------------------------------
  // Save entire About page (PUT /api/aboutcontent)
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/aboutcontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ sections: content.sections }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update content');

      setContent({ ...content, sections: data.sections });
      toast.success('Content updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update content', { autoClose: 1000 });
    }
  };

  // -----------------------------------------------------------------------------
  // NOTE ABOUT Loading States (IMPORTANT FOR NEW STUDENTS)
  //
  // Lesson 12 can render safely even before the fetch completes because:
  // - sections and paragraphs are arrays (empty arrays are valid)
  // - the form can render without throwing errors
  //
  // However, some instructors prefer a LoadingBox so students clearly see
  // when async data is still being fetched.
  // -----------------------------------------------------------------------------

  if (isLoading) return <LoadingBox />;

  // ---------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------
  return (
    <div className='content'>
      <Helmet>
        <title>About Us Edit</title>
      </Helmet>

      <br />
      <h1 className='box'>About Us Edit</h1>

      <form onSubmit={handleSubmit}>
        {/* ------------------------ Jumbotron Upload ------------------------ */}
        <div className='mb-4'>
          <label className='form-label'>Jumbotron Image</label>
          <input
            type='file'
            className='form-control'
            accept='image/*'
            onChange={handleJumbotronUpload}
          />

          {content.jumbotronImage && (
            <div className='mt-3 text-center'>
              <img
                src={content.jumbotronImage.url}
                alt='Jumbotron'
                className='img-fluid'
                style={{ maxHeight: '200px' }}
              />
              <button
                type='button'
                className='btn btn-danger mt-2'
                onClick={handleDeleteJumbotron}
              >
                Delete Jumbotron Image
              </button>
            </div>
          )}
        </div>

        {/* -------------------------- Sections ----------------------------- */}
        {Array.isArray(content.sections) && content.sections.length > 0 ? (
          content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='mb-4 p-3 border rounded'>
              {/* Title */}
              <div className='mb-3'>
                <label className='form-label'>Title {sectionIndex + 1}</label>
                <input
                  type='text'
                  className='form-control'
                  value={section.title}
                  onChange={(e) => handleTitleChange(sectionIndex, e)}
                />
              </div>

              {/* Paragraphs */}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <div key={paragraphIndex} className='mb-3'>
                  <label className='form-label'>
                    Paragraph {paragraphIndex + 1}
                  </label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={paragraph}
                    onChange={(e) =>
                      handleParagraphChange(sectionIndex, paragraphIndex, e)
                    }
                  />
                  <button
                    type='button'
                    className='btn btn-danger mt-2'
                    onClick={() =>
                      handleDeleteParagraph(sectionIndex, paragraphIndex)
                    }
                  >
                    Delete Paragraph
                  </button>
                </div>
              ))}

              <button
                type='button'
                className='btn btn-secondary mt-2 me-2'
                onClick={() => handleAddParagraph(sectionIndex)}
              >
                Add Paragraph
              </button>

              <hr className='my-4' />

              {/* Section Images */}
              <label className='form-label'>
                Images for Section {sectionIndex + 1}
              </label>
              <input
                type='file'
                className='form-control'
                accept='image/*'
                onChange={(e) => handleImageUpload(sectionIndex, e)}
              />

              <div className='mt-3 d-flex flex-wrap gap-3'>
                {section.images.map((image, imageIndex) => (
                  <div key={imageIndex} className='text-center'>
                    <img
                      src={image.url}
                      alt={image.name}
                      className='img-thumbnail'
                      style={{ maxHeight: '150px' }}
                    />
                    <button
                      type='button'
                      className='btn btn-danger btn-sm mt-3'
                      onClick={() =>
                        handleDeleteImage(sectionIndex, imageIndex)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <hr className='my-4' />

              {/* Delete whole section */}
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => handleDeleteSection(sectionIndex)}
              >
                Delete Section
              </button>
            </div>
          ))
        ) : (
          <p>No sections available. Click "Add Section" to create one.</p>
        )}

        <button
          type='button'
          className='btn btn-success mt-2 me-2'
          onClick={handleAddSection}
        >
          Add Section
        </button>
        <button type='submit' className='btn btn-primary mt-2'>
          Save Changes
        </button>
      </form>

      <br />
    </div>
  );
}
