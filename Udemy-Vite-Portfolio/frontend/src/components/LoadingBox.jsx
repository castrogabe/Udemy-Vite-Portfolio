// src/components/LoadingBox.jsx
// -------------------------------------------------------------
// Lesson 3:
// This reusable component displays a Bootstrap loading spinner.
// It is commonly used while waiting for data from an API request
// (for example, when fetching portfolio items or products).
//
// Instead of repeating spinner markup in multiple pages,
// we create one reusable component and import it wherever
// a loading state is needed.
// -------------------------------------------------------------

export default function LoadingBox() {
  return (
    // Center the spinner horizontally and add vertical padding
    <div className='text-center py-5'>
      {/* Bootstrap spinner */}
      {/* role="status" improves accessibility for screen readers */}
      {/* aria-label describes the spinner's purpose */}
      <div className='spinner-border' role='status' aria-label='Loading' />
    </div>
  );
}
