import React from 'react';

export default function BottomFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className='bottom-footer'>
      &copy; {year} My Website. All rights reserved.
    </footer>
  );
}

// If you want to review the commented teaching version of the BottomFooter.jsx setup, check commit lesson-04.
