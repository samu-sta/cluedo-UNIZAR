import React from 'react';
import "./styles/FormField.css";

const FormField = ({ field, error }) => {
  const { id, name, type, label, autoFocus } = field;

  return (
    <article className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        className={error ? 'error' : ''}
        autoFocus={autoFocus}
      />
      {error && (
        <span className="error-message" id={`${id}-error`}>{error}</span>
      )}
    </article>
  );
};

export default FormField;