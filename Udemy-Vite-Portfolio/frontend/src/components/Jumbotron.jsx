// src/components/Jumbotron.jsx
// -------------------------------------------------------------
// Lesson 3:
// Jumbotron displays a large hero banner at the top of the page.
// It uses the "typewriter-effect" package to animate text so it
// appears to be typed out on the screen.
//
// This component receives text as a prop and loops through the
// provided strings using a typewriter animation.
// -------------------------------------------------------------

import React from 'react';
import Typewriter from 'typewriter-effect';

// -------------------------------------------------------------
// Component: Jumbotron
// Props:
//   text -> an array or string of phrases to animate
// Example:
//   <Jumbotron text={["Web Development", "Creative Design"]} />
// -------------------------------------------------------------
const Jumbotron = ({ text }) => (
  // Main hero container (styled in CSS)
  <div className='jumbotron jumbotron-fluid'>
    {/* Container that centers the animated text */}
    <div className='typewriter-container'>
      {/* Typewriter component animates the provided text */}
      <Typewriter
        options={{
          // The text or array of text strings to display
          strings: text,

          // Automatically start typing when component loads
          autoStart: true,

          // Loop continuously through the text strings
          loop: true,
        }}
      />
    </div>
  </div>
);

// Export component so it can be used in other pages
export default Jumbotron;
