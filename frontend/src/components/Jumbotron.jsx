// src/components/Jumbotron.jsx
// -------------------------------------------------------------
// Jumbotron component that displays animated text using
// the "typewriter-effect" library.
//
// The text prop can be a single string or an array of strings.
// Each string is animated in sequence with a looping effect.
// -------------------------------------------------------------

import React from 'react';
import Typewriter from 'typewriter-effect';

const Jumbotron = ({ text }) => (
  <div className='jumbotron jumbotron-fluid'>
    <div className='typewriter-container'>
      <Typewriter
        options={{
          strings: text, // Text or list of strings to animate
          autoStart: true, // Starts typing automatically
          loop: true, // Repeats indefinitely
        }}
      />
    </div>
  </div>
);

export default Jumbotron;
