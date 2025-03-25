import { useState } from 'react';
import useDeductions from '../../hooks/useDeductions';
import DeductionHeader from './components/DeductionHeader';
import DeductionGrid from './components/DeductionGrid';
import DeductionLegend from './components/DeductionLegend';
import './styles/DeductionTable.css';

const DeductionTable = ({ gameInfo, playerCards = [], leftoverCards = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { deductions, updateDeduction, isMobile } = useDeductions(gameInfo, playerCards, leftoverCards);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className={`deduction-table-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <DeductionHeader
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      <main className="deduction-content">
        <DeductionGrid
          deductions={deductions}
          updateDeduction={updateDeduction}
          isMobile={isMobile}
        />
        <DeductionLegend />
      </main>
    </section>
  );
};

export default DeductionTable;