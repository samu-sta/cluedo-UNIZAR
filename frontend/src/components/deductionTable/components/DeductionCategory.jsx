import DeductionItem from './DeductionItem';
import '../styles/DeductionCategory.css';

const DeductionCategory = ({ title, items, updateDeduction }) => {
  return (
    <div className="deduction-category">
      <h4>{title}</h4>
      <ul className="deduction-list">
        {Object.entries(items).map(([name, status]) => (
          <DeductionItem
            key={name}
            name={name}
            status={status}
            onChange={() => updateDeduction(title.toLowerCase(), name)}
          />
        ))}
      </ul>
    </div>
  );
};

export default DeductionCategory;