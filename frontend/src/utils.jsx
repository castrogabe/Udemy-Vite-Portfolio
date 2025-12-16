// src/utils.js (or src/getError.js)
// -------------------------------------------------------------
// Utility function: getError()
// -------------------------------------------------------------
// Purpose:
// This function extracts a readable error message from an error object,
// whether it comes from Axios (backend response) or a general JavaScript error.
// -------------------------------------------------------------

export const getError = (error) => {
  // -------------------------------------------------------------
  // Many HTTP libraries (like Axios) return errors in a nested format:
  // error.response.data.message → contains the backend message
  // error.message → generic fallback message
  // -------------------------------------------------------------
  return error.response && error.response.data.message
    ? error.response.data.message // Use backend message if available
    : error.message; // Otherwise, show the default JS error message
};
