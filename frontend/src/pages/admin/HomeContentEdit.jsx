// src/pages/HomeContentEdit.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SkeletonForm } from '../../components/skeletons';
import useDelayedLoading from '../../hooks/useDelayedLoading';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function HomeContentEdit() {
  const [jumbotronText, setJumbotronText] = useState([]);
  const [sections, setSections] = useState([]);
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [fetchDone, setFetchDone] = useState(false);
  const loading = useDelayedLoading(fetchDone, 2000);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/homecontent`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            Accept: 'application/json',
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setJumbotronText(data.jumbotronText || []);
        // Ensure that each section object has link and linkText properties
        const formattedSections = (data.sections || []).map((section) => ({
          ...section,
          link: section.link || '',
          linkText: section.linkText || '',
        }));
        setSections(formattedSections);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Failed to fetch content');
      } finally {
        // ✅ Important: mark fetch as complete
        setFetchDone(true);
      }
    };
    fetchContent();
  }, [userInfo]);

  const handleJumbotronTextChange = (index, e) => {
    const newText = [...jumbotronText];
    newText[index] = e.target.value;
    setJumbotronText(newText);
  };

  const handleAddJumbotronText = () => {
    setJumbotronText([...jumbotronText, '']);
  };

  const handleDeleteJumbotronText = (index) => {
    const newText = [...jumbotronText];
    newText.splice(index, 1);
    setJumbotronText(newText);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleAddSection = () => {
    // Include new fields in the initial state for a new section
    setSections([
      ...sections,
      { title: '', content: '', link: '', linkText: '' },
    ]);
  };

  const handleDeleteSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/homecontent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          jumbotronText,
          sections,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJumbotronText(data.jumbotronText);
      setSections(data.sections);
      toast.success('Content updated successfully', { autoClose: 1000 });
    } catch (error) {
      console.error('Failed to update content:', error);
      toast.error('Failed to update content');
    }
  };

  // ---------- Render ----------
  if (loading) return <SkeletonForm />;

  return (
    <div className='content'>
      <Helmet>
        <title>Edit Home Content</title>
      </Helmet>
      <br />
      <h1 className='box'>Edit Home Content</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Dynamic Jumbotron Text */}
        {jumbotronText.map((text, index) => (
          <div className='mb-3' key={index}>
            <label htmlFor={`formJumbotronText${index}`} className='form-label'>
              Typewriter Effect Text {index + 1}
            </label>
            <input
              id={`formJumbotronText${index}`}
              type='text'
              className='form-control'
              value={text}
              onChange={(e) => handleJumbotronTextChange(index, e)}
              required
            />
            <button
              type='button'
              className='btn btn-danger mt-2'
              onClick={() => handleDeleteJumbotronText(index)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type='button'
          className='btn btn-success mt-2 me-2'
          onClick={handleAddJumbotronText}
        >
          Add Typewriter Effect Text
        </button>
        <hr />
        {/* Dynamic Content Sections */}
        {sections.map((section, index) => (
          <div className='mb-3 border p-3 rounded' key={index}>
            <h5 className='mb-3'>Section {index + 1}</h5>
            <div className='mb-3'>
              <label
                htmlFor={`formSectionTitle${index}`}
                className='form-label'
              >
                Title
              </label>
              <input
                id={`formSectionTitle${index}`}
                type='text'
                className='form-control'
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(index, 'title', e.target.value)
                }
                required
              />
            </div>
            <div className='mb-3'>
              <label
                htmlFor={`formSectionContent${index}`}
                className='form-label'
              >
                Content
              </label>
              <textarea
                id={`formSectionContent${index}`}
                className='form-control'
                rows={4}
                value={section.content}
                onChange={(e) =>
                  handleSectionChange(index, 'content', e.target.value)
                }
                required
              />
            </div>
            <div className='mb-3'>
              <label
                htmlFor={`formSectionLinkText${index}`}
                className='form-label'
              >
                Button Text (Optional)
              </label>
              <input
                id={`formSectionLinkText${index}`}
                type='text'
                className='form-control'
                value={section.linkText}
                onChange={(e) =>
                  handleSectionChange(index, 'linkText', e.target.value)
                }
              />
            </div>
            <div className='mb-3'>
              <label htmlFor={`formSectionLink${index}`} className='form-label'>
                Button Link (Optional)
              </label>
              <input
                id={`formSectionLink${index}`}
                type='text'
                className='form-control'
                value={section.link}
                onChange={(e) =>
                  handleSectionChange(index, 'link', e.target.value)
                }
              />
            </div>
            <button
              type='button'
              className='btn btn-danger mt-2'
              onClick={() => handleDeleteSection(index)}
            >
              Delete Section
            </button>
          </div>
        ))}
        <button
          type='button'
          className='btn btn-success mt-2 me-2'
          onClick={handleAddSection}
        >
          Add New Section
        </button>
        &nbsp;
        <button type='submit' className='btn btn-primary mt-2'>
          Save Changes
        </button>
      </form>
      <br />
    </div>
  );
}

// If you want to review the commented teaching version of the HomeContentEdit.jsx setup, check commit lesson-11.
// lesson-15 Skeletons
