export default function WebsiteCard({ website = {} }) {
  const { image, name, languageDescription, description, link } = website;

  return (
    <div className='card website-card h-100'>
      <div className='row g-0'>
        {/* Image */}
        <div className='col-12 col-md-6'>
          {image ? (
            <img
              src={image}
              alt={name || 'Website preview'}
              loading='lazy'
              className='img-fluid website-card__img rounded-start-md'
            />
          ) : (
            <div className='d-flex align-items-center justify-content-center bg-light-subtle text-secondary-emphasis p-5 h-100'>
              No image
            </div>
          )}
        </div>

        {/* Body */}
        <div className='col-12 col-md-6'>
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
