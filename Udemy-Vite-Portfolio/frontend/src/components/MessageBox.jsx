// src/components/MessageBox.jsx
// -------------------------------------------------------------
// Lesson 3:
// This reusable component displays Bootstrap alert messages.
// It is commonly used to show errors, warnings, or information
// returned from API requests.
//
// Instead of repeating alert markup across multiple pages,
// we create a single reusable component and pass in the
// message content and alert style as props.
// -------------------------------------------------------------

export default function MessageBox({ variant = 'info', children }) {
  return (
    // Bootstrap alert container
    // The variant prop controls the alert color (info, danger, success, etc.)
    <div className={`alert alert-${variant}`} role='alert'>
      {/* 
        children represents the message content placed
        between the opening and closing MessageBox tags.
        Example:
        <MessageBox variant="danger">Error loading data</MessageBox>
      */}
      {children}
    </div>
  );
}
