/**
 * @fileoverview Componente que muestra la leyenda de los iconos utilizados en la tabla de deducciones
 * @author Samuel Felipe
 */
import { FaCheck, FaQuestion, FaTimes } from "react-icons/fa";
import '../styles/DeductionLegend.css';

const DeductionLegend = () => {
  return (
    <footer className="deduction-legend">
      <article className="legend-item">
        <FaTimes className="deduction-icon no" /> Descartado
      </article>
      <article className="legend-item">
        <FaCheck className="deduction-icon yes" /> Confirmado
      </article>
      <article className="legend-item">
        <FaQuestion className="deduction-icon maybe" /> Posible
      </article>
    </footer>
  );
};

export default DeductionLegend;