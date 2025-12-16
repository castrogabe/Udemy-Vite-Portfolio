// src/components/LoadingBox.jsx
// -----------------------------------------------------------------------------
// LoadingBox — Reusable Loading Indicator (Lesson 4)
// -----------------------------------------------------------------------------
//
// LoadingBox is shown while data is being fetched from the backend.
//
// WHY this component exists:
// - React pages often depend on async data (API calls)
// - That data is NOT available immediately
// - Rendering the UI too early can cause empty fields, errors, or confusion
//
// WHEN to use LoadingBox:
// - While waiting for API data to load
// - Before rendering forms, tables, or lists that depend on fetched data
// - During create / update / delete actions
//
// HOW it works:
// - Displays a centered Bootstrap spinner
// - Used with conditional rendering:
//
//   loading ? <LoadingBox /> : <ActualContent />
//
// NOTE:
// - Later lessons replace LoadingBox with Skeleton components for better UX
// - The conditional rendering logic stays the same
// -----------------------------------------------------------------------------

export default function LoadingBox() {
  return (
    <div className='text-center py-5'>
      {/* Bootstrap loading spinner with accessible label */}
      <div className='spinner-border' role='status' aria-label='Loading' />
    </div>
  );
}
