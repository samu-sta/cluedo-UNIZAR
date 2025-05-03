/**
 * @fileoverview Componente que muestra la cuadrícula de deducciones organizando los elementos por categorías
 * @author Samuel Felipe
 */
import DeductionCategory from './DeductionCategory';
import '../styles/DeductionGrid.css';

const DeductionGrid = ({ deductions, updateDeduction, isMobile }) => {
  return (
    <div className={`deduction-grid ${isMobile ? 'mobile' : ''}`}>
      <DeductionCategory
        title="Personajes"
        deductionCategory="characters"
        items={deductions.characters}
        updateDeduction={updateDeduction}
      />
      <DeductionCategory
        title="Armas"
        deductionCategory="weapons"
        items={deductions.weapons}
        updateDeduction={updateDeduction}
      />
      <DeductionCategory
        title="Habitaciones"
        deductionCategory="rooms"
        items={deductions.rooms}
        updateDeduction={updateDeduction}
      />
    </div>
  );
};

export default DeductionGrid;