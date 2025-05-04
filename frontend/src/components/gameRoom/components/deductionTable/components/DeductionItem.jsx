import { FaCheck, FaQuestion, FaTimes } from "react-icons/fa";
import '../styles/DeductionItem.css';

const DeductionItem = ({ name, status, onChange }) => {
  // Obtener el icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'yes':
        return <FaCheck className="deduction-icon yes" title="Confirmado" />;
      case 'no':
        return <FaTimes className="deduction-icon no" title="Descartado" />;
      case 'maybe':
        return <FaQuestion className="deduction-icon maybe" title="Posible" />;
      default:
        return null;
    }
  };

  return (
    <li
      className={`deduction-item ${status}`}
      onClick={onChange}
    >
      <span className="deduction-name">{name}</span>
      <span className="deduction-status">
        {getStatusIcon(status)}
      </span>
    </li>
  );
};

export default DeductionItem;