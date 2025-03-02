import './componentAssets/cards.css'

// Feature Card Component
export const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: string
  title: string
  description: string
}) => (
  <div className="feature-card">
    <i className={`fas ${icon}`}></i>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
)

// Testimonial Card Component
export const TestimonialCard = ({
  quote,
  author,
  rating
}: {
  quote: string
  author: string
  rating: number
}) => (
  <div className="testimonial-card">
    <p>{quote}</p>
    <div className="testimonial-author">{author}</div>
    <div className="rating">
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </div>
  </div>
)
