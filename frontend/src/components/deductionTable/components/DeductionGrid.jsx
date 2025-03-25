import DeductionCategory from './DeductionCategory';
import '../styles/DeductionGrid.css';

const DeductionGrid = ({ deductions, updateDeduction, isMobile }) => {
  return (
    <div className={`deduction-grid ${isMobile ? 'mobile' : ''}`}>
      <DeductionCategory
        title="Personajes"
        items={deductions.characters}
        updateDeduction={updateDeduction}
      />
      <DeductionCategory
        title="Armas"
        items={deductions.weapons}
        updateDeduction={updateDeduction}
      />
      <DeductionCategory
        title="Habitaciones"
        items={deductions.rooms}
        updateDeduction={updateDeduction}
      />
    </div>
  );
};

export default DeductionGrid;