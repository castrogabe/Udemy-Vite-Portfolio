// src/components/BottomFooter.jsx
// -------------------------------------------------------------
// Simple bottom footer that displays the current year dynamically.
// This component sits below the main Footer and stays consistent
// across all pages.
// -------------------------------------------------------------

import React from 'react';

export default function BottomFooter() {
  const year = new Date().getFullYear(); // Get the current year

  return (
    <footer className='bottom-footer'>
      &copy; {year} My Website. All rights reserved.
    </footer>
  );
}
