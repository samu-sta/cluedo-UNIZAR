/**
 * @fileoverview Componente reutilizable para mostrar el título de las secciones
 * @author Samuel Felipe
 */
import '../styles/SectionTitle.css';

const SectionTitle = ({ children }) => (
  <h2 className='home-section-title'>
    <span className="home-section-title-inner">{children}</span>
  </h2>
);

export default SectionTitle;