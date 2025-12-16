export default function MessageBox({ variant = 'info', children }) {
  return (
    <div className={`alert alert-${variant}`} role='alert'>
      {children}
    </div>
  );
}

// If you want to review the commented teaching version of the messageBox.jsx setup, check commit lesson-04.
