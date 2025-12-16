export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// If you want to review the commented teaching version of the utils setup, check commit lesson-04.
