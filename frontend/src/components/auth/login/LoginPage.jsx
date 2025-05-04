import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import useLoginPage from './hooks/useLoginPage';
import { LOGIN_FORM_FIELDS } from '../../../utils/constants';
import FormField from '../components/FormField';
import "./styles/LoginPage.css";

const LoginPage = ({ setUser, loginUser }) => {
  const { errors, isLoading, handleSubmit, serverError } = useLoginPage(setUser, loginUser);

  return (
    <main className="login">
      <div className="decorative-element circle top-left" aria-hidden="true"></div>
      <div className="decorative-element dots bottom-right" aria-hidden="true"></div>

      <section className="login-content">
        <header className="login-header">
          <h1 className="login-title">Bienvenido a <span className="accent">Cluedo UNIZAR</span></h1>
          <p className="login-subtitle">Inicia sesión para continuar resolviendo misterios</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          {LOGIN_FORM_FIELDS.map((field) => (
            <FormField
              key={field.id}
              field={field}
              error={errors[field.name] || serverError}
            />
          ))}

          <button
            type="submit"
            className={`btn primary with-shadow large ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            ¿No tienes una cuenta? {' '}
            <Link to={ROUTES.REGISTER} className="register-link">
              Regístrate</Link>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
