/*************************************************
 * Página de registro
 * 
 * Formulario para que los nuevos usuarios puedan crear
 * una cuenta proporcionando su email, nombre de usuario
 * y contraseña con validación de campos.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import useRegisterPage from './hooks/useRegisterPage';
import { REGISTER_FORM_FIELDS } from '../../../utils/constants';
import FormField from '../components/FormField';
import "./styles/RegisterPage.css";

const RegisterPage = ({ registerUser }) => {
  const { errors, handleSubmit } = useRegisterPage(registerUser);

  return (
    <main className="register">
      <div className="decorative-element circle top-left" aria-hidden="true"></div>
      <div className="decorative-element dots bottom-right" aria-hidden="true"></div>

      <section className="register-content">
        <header className="register-header">
          <h1 className="register-title">Únete a <span className="accent">Cluedo UNIZAR</span></h1>
          <p className="register-subtitle">Crea una cuenta para empezar a resolver misterios</p>
        </header>

        <form className="register-form" onSubmit={handleSubmit}>
          {REGISTER_FORM_FIELDS.map((field) => (
            <FormField
              key={field.id}
              field={field}
              error={errors[field.name]}
            />
          ))}

          <button
            type="submit"
            className="btn primary with-shadow large"
          >
            Crear cuenta
          </button>
        </form>

        <footer className="register-footer">
          <p>
            ¿Ya tienes una cuenta? {' '}
            <Link to={ROUTES.LOGIN} className="login-link">
              Inicia sesión</Link>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default RegisterPage;
