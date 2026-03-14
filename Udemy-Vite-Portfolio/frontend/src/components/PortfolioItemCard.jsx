// src/components/PortfolioItemCard.jsx
// -------------------------------------------------------------
// Lesson 3:
// This reusable component displays a single portfolio project.
// It shows:
//
// • Project image
// • Project name
// • Technologies used
// • Description
// • Link to the live website
//
// The component receives a portfolioItem object as a prop
// and safely extracts the values needed for display.
// -------------------------------------------------------------

export default function PortfolioItemCard({ portfolioItem = {} }) {
  // Destructure fields from the portfolio item object
  const { image, name, languageDescription, description, link } = portfolioItem;

  return (
    // Main card container
    <div className='portfolio-card box'>
      <div className='row g-0 align-items-center'>
        {/* -------------------------------------------------------------
            Image Section
            Displays the project screenshot if available.
            If no image exists, a placeholder message is shown.
        ------------------------------------------------------------- */}
        <div className='col-12 col-md-5'>
          {/* Image */}
          {image ? (
            <div className='portfolio-img'>
              <img
                src={image}
                // Accessibility text
                alt={name || 'Portfolio preview'}
                // Improves performance by delaying off-screen images
                loading='lazy'
              />
            </div>
          ) : (
            // Placeholder when no project image exists
            <div className='portfolio-no-image'>No image</div>
          )}
        </div>

        {/* -------------------------------------------------------------
            Text Content Section
            Displays project information such as title,
            technologies used, description, and link.
        ------------------------------------------------------------- */}
        <div className='col-12 col-md-7'>
          <div className='portfolio-content'>
            {/* Project title */}
            <h3 className='portfolio-title'>{name || 'Untitled'}</h3>

            {/* Technologies used (React, Node, MongoDB, etc.) */}
            {languageDescription && (
              <p className='portfolio-tech'>{languageDescription}</p>
            )}

            {/* Short project description */}
            {description && (
              <p className='portfolio-description'>{description}</p>
            )}

            {/* Button linking to the live website */}
            {link && (
              <a
                href={link}
                // Open in a new browser tab
                target='_blank'
                // Security best practice when opening new tabs
                rel='noopener noreferrer'
                className='btn btn-primary portfolio-btn'
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
