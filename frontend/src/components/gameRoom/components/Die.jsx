/*************************************************
 * Dado individual
 * 
 * Componente que representa un único dado con su valor
 * numérico correspondiente, mostrando puntos según
 * el valor obtenido en el lanzamiento.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import '../styles/Die.css';

const Die = ({ value }) => {
  return (
    <figure className="die">
      {[...Array(value)].map((_, i) => (
        <figure key={i} className={`dot dot-${value}-${i + 1}`}></figure>
      ))}
    </figure>
  );
};

export default Die;