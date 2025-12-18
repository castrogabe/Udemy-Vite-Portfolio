import { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox.jsx';
import MessageBox from '../../components/MessageBox.jsx';
import { Store } from '../../Store';
import { getError, getImageUrl } from '../../utils'; // lesson-10 getImageUrl

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false };

    default:
      return state;
  }
};

export default function WebsiteEdit() {
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      loadingUpdate: false,
      loadingUpload: false,
    });

  const { id } = useParams(); // website id
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [language, setLanguage] = useState('');
  const [languageDescription, setLanguageDescription] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  // load website
  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await fetch(`/api/websites/${id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

        setName(data.name || '');
        setSlug(data.slug || '');
        setImage(data.image || '');
        setLanguage(data.language || '');
        setLanguageDescription(data.languageDescription || '');
        setDescription(data.description || '');
        setLink(data.link || '');

        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchWebsite();
  }, [id]);

  // update website
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const body = {
        name: name.trim(),
        slug: slug.trim(),
        image: image.trim(),
        language: language.trim(),
        languageDescription: languageDescription.trim(),
        description: description.trim(),
        link: link.trim(),
      };
      const res = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Website updated');
      navigate('/admin/websites');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  // upload image
  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo.token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
      // uploadRouter returns a string path (e.g., "/uploads/file.jpg")
      setImage(typeof data === 'string' ? data : data?.path || image);
      dispatch({ type: 'UPLOAD_SUCCESS' });
      toast.success('Image uploaded');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div className='content'>
      <br />
      <Helmet>
        <title>Edit Website {id}</title>
      </Helmet>

      <div className='container'>
        <div className='box mx-auto'>
          <div className='d-flex align-items-center justify-content-between'>
            <h4 className='mb-0'>Edit Website {id}</h4>
            <Link to='/admin/websites' className='btn btn-outline-secondary'>
              Back
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant='danger'>{error}</MessageBox>
        ) : (
          <div className='box row g-3'>
            <form onSubmit={submitHandler} noValidate>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  id='name'
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='slug' className='form-label'>
                  Slug
                </label>
                <input
                  id='slug'
                  className='form-control'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <div className='form-text'>Unique identifier used in URLs.</div>
              </div>

              <div className='mb-3'>
                <label htmlFor='image' className='form-label'>
                  Image URL
                </label>
                <input
                  id='image'
                  className='form-control'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
                <div className='mt-2 d-flex align-items-center gap-2'>
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control'
                    onChange={uploadFileHandler}
                  />
                  {loadingUpload && (
                    <span
                      className='spinner-border spinner-border-sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )}
                </div>
                {image && (
                  <div className='mt-3'>
                    <img
                      src={getImageUrl(image)}
                      alt='preview'
                      className='img-thumb'
                    />
                  </div>
                )}
              </div>

              <div className='mb-3'>
                <label htmlFor='language' className='form-label'>
                  Language
                </label>
                <input
                  id='language'
                  className='form-control'
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='languageDescription' className='form-label'>
                  Language Description
                </label>
                <input
                  id='languageDescription'
                  className='form-control'
                  value={languageDescription}
                  onChange={(e) => setLanguageDescription(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='description' className='form-label'>
                  Description
                </label>
                <textarea
                  id='description'
                  className='form-control'
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='link' className='form-label'>
                  Link
                </label>
                <input
                  id='link'
                  type='url'
                  className='form-control'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
                {link && (
                  <div className='form-text'>
                    <a href={link} target='_blank' rel='noopener noreferrer'>
                      Open site ↗
                    </a>
                  </div>
                )}
              </div>

              <div className='mb-3 d-grid'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      />
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// If you want to review the commented teaching version of the WebsiteEdit.jsx setup, check commit lesson-09.
// lesson-10 updated getImageUrl
