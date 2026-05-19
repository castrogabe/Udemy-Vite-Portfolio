// src/components/Wrapper.jsx
import React from 'react';

/**
 * AdminWrapper
 * Centers admin content and provides consistent padding and layout.
 * Optionally takes a `title` and `children`.
 */
export default function Wrapper({ title, children }) {
  return (
    <div className='content wrapper'>
      {title && <h4 className='box text-center mb-4'>{title}</h4>}
      <div className='container d-flex justify-content-center'>
        <div className='col-md-8 col-lg-6'>{children}</div>
      </div>
    </div>
  );
}
