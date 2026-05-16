// src/components/SectionImages.jsx
import React from 'react';

export default function SectionImages({ images }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className='d-flex flex-wrap justify-content-center gap-3 mt-3'>
      {images.map((image, imageIndex) => (
        <img
          key={imageIndex}
          src={image.url}
          alt={image.name || `image-${imageIndex}`}
          className='img-fluid'
          style={{ maxHeight: '350px' }}
        />
      ))}
    </div>
  );
}
