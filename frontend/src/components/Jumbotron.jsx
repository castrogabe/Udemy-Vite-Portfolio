import React from 'react';
import Typewriter from 'typewriter-effect';

const Jumbotron = ({ text }) => (
  <div className='jumbotron jumbotron-fluid'>
    <div className='typewriter-container'>
      <Typewriter
        options={{
          strings: text,
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  </div>
);

export default Jumbotron;

// If you want to review the commented teaching version of the Jumbotron.jsx setup, check commit lesson-04.
