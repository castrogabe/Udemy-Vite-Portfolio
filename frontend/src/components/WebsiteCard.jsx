// src/components/WebsiteCard.jsx
// -------------------------------------------------------------
// Displays a single website entry as a responsive Bootstrap card.
// Each card shows an image, title, tech stack description, and link.
//
// Props:
//   - website: object containing { image, name, languageDescription, description, link }
// -------------------------------------------------------------

export default function WebsiteCard({ website = {} }) {
  // Destructure key fields from the website object for readability
  const { image, name, languageDescription, description, link } = website;

  return (
    <div className='card website-card h-100'>
      <div className='row g-0'>
        {/* -----------------------------------------------------
            Left Side — Image Section
            ----------------------------------------------------- */}
        <div className='col-12 col-md-6'>
          {image ? (
            <img
              src={image}
              alt={name || 'Website preview'}
              loading='lazy'
              className='img-fluid website-card__img rounded-start-md'
            />
          ) : (
            // Fallback placeholder when image is missing
            <div className='d-flex align-items-center justify-content-center bg-light-subtle text-secondary-emphasis p-5 h-100'>
              No image
            </div>
          )}
        </div>

        {/* -----------------------------------------------------
            Right Side — Text / Details Section
            ----------------------------------------------------- */}
        <div className='col-12 col-md-6'>
          <div className='card-body'>
            <h5 className='card-title mb-2'>{name || 'Untitled'}</h5>

            {/* Display language stack description if available */}
            {languageDescription && (
              <p className='card-text mb-2'>{languageDescription}</p>
            )}

            {/* Website summary or description */}
            {description && <p className='card-text'>{description}</p>}

            {/* External link opens in new tab */}
            {link && (
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary mt-2'
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
