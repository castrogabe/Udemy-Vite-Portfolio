// src/components/MessageBox.jsx
// -----------------------------------------------------------------------------
// MessageBox — Reusable Message / Alert Component (Lesson 4)
// -----------------------------------------------------------------------------
//
// MessageBox is used to display feedback messages to the user.
//
// WHY this component exists:
// - API requests can fail (network issues, permissions, server errors)
// - Sometimes there is no data to show (empty lists, search results)
// - Users need clear feedback about what is happening
//
// WHEN to use MessageBox:
// - To display error messages from failed API requests
// - To show informational messages (e.g. "No items found")
// - To show success or warning messages when appropriate
//
// HOW it works:
// - Wraps Bootstrap's alert component
// - Accepts a `variant` prop to control color:
//     'info'    (default)
//     'success'
//     'warning'
//     'danger'
// - The message content is passed as children
//
// Example usage:
//
//   <MessageBox variant="danger">Failed to load data</MessageBox>
//
// NOTE:
// - MessageBox is often used together with LoadingBox
// - Later lessons will combine MessageBox with Skeleton loaders
//   for better user experience
// -----------------------------------------------------------------------------

export default function MessageBox({ variant = 'info', children }) {
  return (
    <div className={`alert alert-${variant}`} role='alert'>
      {children}
    </div>
  );
}
