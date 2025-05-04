/*************************************************
 * Página de inicio
 * 
 * Página principal que muestra la presentación del juego,
 * características principales y botones de acción para
 * comenzar a jugar o registrarse.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { useEffect } from 'react';
import useIsMobile from '../common/hooks/useIsMobile';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import RulesSection from './components/RulesSection';
import './styles/Home.css';

const Home = () => {
  const isMobile = useIsMobile();
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <main className="home">
      <HeroSection isMobile={isMobile} />
      <FeaturesSection />
      <RulesSection isMobile={isMobile} />
      <CTASection />
    </main>
  );
};

export default Home;