/**
 * @fileoverview Componente de sección de héroe que muestra la introducción principal del juego
 * @author Samuel Felipe
 */
import { HOME, ROUTES } from "../../../utils/constants";
import { Link } from "react-router-dom";
import React from "react";
import '../styles/HeroSection.css';

const HeroSection = ({ isMobile }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <section className={`home-hero ${isMobile ? 'home-hero-mobile' : 'home-hero-desktop'}`}>
      <header className="home-hero-content">
        <span className="home-hero-badge">{HOME.HERO.ASIDE}</span>
        <h1>
          {HOME.HERO.TITLE} <br /> <span className="accent">{HOME.HERO.BRAND}</span>
        </h1>
        <p className="home-hero-description">{HOME.HERO.DESCRIPTION}</p>

        <nav className="home-hero-buttons">
          {user ? (
            <Link to={ROUTES.GAMES} className="btn primary with-shadow">
              Jugar Partida
            </Link>
          ) : (
            <>
              <Link to={ROUTES.REGISTER} className="btn primary with-shadow">
                {HOME.HERO.REGISTER_BTN}
              </Link>
              <Link to={ROUTES.LOGIN} className="btn secondary">
                {HOME.HERO.LOGIN_BTN}
              </Link>
            </>
          )}
        </nav>

        <section className="home-hero-stats">
          {HOME.HERO.STATS.map((stat, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="home-stat-separator" aria-hidden="true"></div>}
              <article className="home-stat-item">
                <span className="home-stat-value">{stat.value}</span>
                <span className="home-stat-label">{stat.label}</span>
              </article>
            </React.Fragment>
          ))}
        </section>
      </header>

      <figure className="home-hero-image-container">
        <div className="home-image-backdrop" aria-hidden="true"></div>
        <img
          src={HOME.IMAGES.DETECTIVE}
          alt={HOME.HERO.IMAGE_ALT}
          className="home-hero-image"
        />
      </figure>
    </section>
  );
}

export default HeroSection;