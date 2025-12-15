import React from 'react';

export default function BottomFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className='bottom-footer'>
      &copy; {year} My Website. All rights reserved.
    </footer>
  );
}
