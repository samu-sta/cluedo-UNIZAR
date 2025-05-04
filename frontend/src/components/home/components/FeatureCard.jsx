import '../styles/FeatureCard.css';

const FeatureCard = ({ icon, iconLabel, title, description }) => {

  const handleCardClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <li className="feature-card" onClick={handleCardClick}>
      <div className="feature-icon-wrapper">
        <span role="img" aria-label={iconLabel} className="feature-icon">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-arrow">→</span>
    </li>
  );
};

export default FeatureCard;