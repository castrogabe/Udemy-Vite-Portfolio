import { getImageUrl } from '@/utils'; // lesson-10

export default function WebsiteCard({ website = {} }) {
  const { image, name, languageDescription, description, link } = website;

  return (
    <div className='card website-card h-100'>
      <div className='row g-0'>
        {/* Image column */}
        <div className='col-12 col-md-5'>
          {image ? (
            <div className='portfolio-card'>
              <div className='portfolio-img-wrap'>
                {/* updated lesson-10 */}
                <img
                  src={getImageUrl(image)}
                  alt={name || 'Website preview'}
                  loading='lazy'
                  decoding='async'
                />
              </div>
            </div>
          ) : (
            <div className='d-flex align-items-center justify-content-center bg-light-subtle text-secondary-emphasis p-5 h-100'>
              No image
            </div>
          )}
        </div>

        {/* Text column */}
        {/* was col-md-6 */}
        <div className='col-12 col-md-7'>
          <div className='card-body'>
            <h5 className='card-title mb-2'>{name || 'Untitled'}</h5>
            {languageDescription && (
              <p className='card-text mb-2'>{languageDescription}</p>
            )}
            {description && <p className='card-text'>{description}</p>}
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

// If you want to review the commented teaching version of the WebsiteCard.jsx setup, check commit lesson-04.
// lesson-10 getImageUrl
