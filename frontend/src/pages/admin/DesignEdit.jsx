import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function DesignEdit() {
  const [content, setContent] = useState({
    sections: [],
    jumbotronImage: null, // Lesson 13: Design now has an optional jumbotron image
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  // ------------------------------------------------------------
  // Lesson 13: Load dynamic design content (sections + jumbotron)
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/designcontent`, {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : {},
        });
        const data = await res.json();
        if (res.ok) {
          setContent({
            sections: Array.isArray(data.sections) ? data.sections : [],
            jumbotronImage: data.jumbotronImage || null,
          });
        } else {
          throw new Error(data.message || 'Failed to fetch content');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load content', { autoClose: 1000 });
      }
    };
    fetchContent();
  }, [userInfo]);

  // -----------------------
  // Section field modifiers
  // -----------------------
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

  // ------------------------------------------------------------
  // Lesson 13: Add new section including new fields:
  //   link, linkText → used for optional buttons in the Design page.
  // ------------------------------------------------------------
  const handleAddSection = () => {
    setContent((prevContent) => ({
      ...prevContent,
      sections: [
        ...prevContent.sections,
        { title: '', paragraphs: [''], images: [], link: '', linkText: '' },
      ],
    }));
  };

  const handleDeleteSection = (sectionIndex) => {
    const newSections = [...content.sections];
    newSections.splice(sectionIndex, 1);
    setContent({ ...content, sections: newSections });
  };

  // ------------------------------------------------------------
  // Lesson 13: Upload a section image
  // Backend returns: { image: { url, name } }
  // ------------------------------------------------------------
  const handleImageUpload = async (sectionIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/api/designcontent/image`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      const newSections = [...content.sections];
      newSections[sectionIndex].images.push(data.image); // Add new image
      setContent({ ...content, sections: newSections });
      toast.success('Image uploaded successfully', { autoClose: 1000 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', { autoClose: 1000 });
    }
  };

  // ------------------------------------------------------------
  // Lesson 13: Delete image from DB + filesystem
  // ------------------------------------------------------------
  const handleDeleteImage = async (sectionIndex, imageIndex) => {
    const imageToDelete = content.sections[sectionIndex].images[imageIndex];

    try {
      const res = await fetch(`${API_BASE}/api/designcontent/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ imageName: imageToDelete.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete image');
      }

      const newSections = [...content.sections];
      newSections[sectionIndex].images.splice(imageIndex, 1);
      setContent({ ...content, sections: newSections });
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete image');
    }
  };

  // ------------------------------------------------------------
  // Lesson 13: Upload jumbotron image for the Design page
  // ------------------------------------------------------------
  const handleJumbotronUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('jumbotronImage', file);

    try {
      const res = await fetch(`${API_BASE}/api/designcontent/jumbotron`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload jumbotron image');
      }

      setContent({ ...content, jumbotronImage: data.jumbotronImage });
      toast.success('Jumbotron image uploaded successfully', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', {
        autoClose: 1000,
      });
    }
  };

  // ------------------------------------------------------------
  // Delete jumbotron image
  // ------------------------------------------------------------
  const handleDeleteJumbotron = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/designcontent/jumbotron`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete jumbotron image');
      }

      setContent({ ...content, jumbotronImage: null });
      toast.success('Jumbotron image deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete image');
    }
  };

  // ------------------------------------------------------------
  // Lesson 13: Save all sections (bulk update)
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/designcontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ sections: content.sections }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update content');
      }

      setContent({ ...content, sections: data.sections });
      toast.success('Content updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update content', {
        autoClose: 1000,
      });
    }
  };

  // ------------------------------------------------------------
  // NEW: Generic handler for link + linkText fields per section
  // ------------------------------------------------------------
  const handleSectionFieldChange = (sectionIndex, field, value) => {
    const newSections = [...content.sections];
    newSections[sectionIndex][field] = value;
    setContent({ ...content, sections: newSections });
  };

  // ------------------------------------------------------------
  // NOTE ABOUT LoadingBox (INTENTIONAL OMISSION)

  // This editor does NOT use LoadingBox.

  // Why?
  // - The editor can safely render with empty state
  // - Sections and images are added progressively
  // - This provides a smoother CMS-style editing experience

  // In contrast:
  // - Public pages (Design, About) MUST wait for data
  // - Edit forms like WebsiteEdit MUST block rendering

  // This distinction is intentional and important.
  // ------------------------------------------------------------

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------

  return (
    <div className='content'>
      <Helmet>
        <title>Design Edit</title>
      </Helmet>
      <br />
      <h1 className='box'>Design Edit</h1>
      <form onSubmit={handleSubmit}>
        {/* Jumbotron Image Upload and Display */}
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

        {/* Dynamic Sections */}
        {Array.isArray(content.sections) && content.sections.length > 0 ? (
          content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='mb-4 p-3 border rounded'>
              <div className='mb-3'>
                <label
                  htmlFor={`formTitle${sectionIndex}`}
                  className='form-label'
                >
                  Title {sectionIndex + 1}
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={section.title}
                  onChange={(e) => handleTitleChange(sectionIndex, e)}
                />
              </div>

              {/* Dynamic Paragraphs */}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <div key={paragraphIndex} className='mb-3'>
                  <label
                    htmlFor={`formParagraph${sectionIndex}-${paragraphIndex}`}
                    className='form-label'
                  >
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

              {/* Dynamic Images */}
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

              {/* Button Text Input (New) */}
              <div className='mb-3'>
                <label className='form-label'>Button Text (Optional)</label>
                <input
                  type='text'
                  className='form-control'
                  value={section.linkText || ''}
                  onChange={(e) =>
                    // ✅ USE the correct generic handler here
                    handleSectionFieldChange(
                      sectionIndex,
                      'linkText',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Button Link Input (New) */}
              <div className='mb-3'>
                <label className='form-label'>Button Link (Optional)</label>
                <input
                  type='text'
                  className='form-control'
                  value={section.link || ''}
                  onChange={(e) =>
                    // ✅ USE the correct generic handler here
                    handleSectionFieldChange(
                      sectionIndex,
                      'link',
                      e.target.value
                    )
                  }
                />
              </div>

              <hr className='my-4' />

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
