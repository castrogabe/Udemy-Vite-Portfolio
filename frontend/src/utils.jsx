// utils.jsx
export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const getApiBaseUrl = () =>
  import.meta.env.VITE_API_BASE_URL ??
  (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

export const getImageUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // already absolute

  // If it's an uploaded file, fetch from backend
  if (path.startsWith('/uploads')) {
    const base = getApiBaseUrl();
    return `${base}${path}`;
  }

  // Otherwise assume it's a frontend public asset (e.g., /images/foo.png)
  return path;
};

// If you want to review the commented teaching version of the utils.jsx setup, check commit lesson-04.
// lesson-10 getImageUrl from backend uploads
