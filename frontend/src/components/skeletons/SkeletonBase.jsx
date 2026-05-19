// src/components/skeletons/SkeletonBase.jsx
import React from 'react';

export default function SkeletonBase() {
  return (
    <div className='animate-pulse'>
      {/* Jumbotron Section */}
      <div className='skeleton-jumbotron box mb-4 text-center p-5 bg-light rounded'>
        <div className='placeholder-glow'>
          <div className='placeholder col-8 mb-3'></div>
          <div className='placeholder col-6'></div>
        </div>
      </div>

      {/* Page Content Section */}
      <div className='content'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='skeleton-section box p-4 mb-4'>
            <div className='placeholder-glow'>
              <div className='placeholder col-4 mb-3'></div>
              <div className='placeholder col-10 mb-2'></div>
              <div className='placeholder col-8 mb-2'></div>
              <div className='placeholder col-6'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
