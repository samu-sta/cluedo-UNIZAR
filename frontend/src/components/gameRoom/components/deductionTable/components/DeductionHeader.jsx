import { IoIosArrowDown } from "react-icons/io";
import '../styles/DeductionHeader.css';

const DeductionHeader = ({ isCollapsed, toggleCollapse }) => {
  return (
    <header className="deduction-header" onClick={toggleCollapse}>
      <h3>Tabla de Descarte</h3>
      <button
        className={`toggle-deduction ${isCollapsed ? 'collapsed' : 'expanded'}`}
        aria-label="Mostrar u ocultar tabla de descarte"
      >
        <IoIosArrowDown />
      </button>
    </header>
  );
};

export default DeductionHeader;