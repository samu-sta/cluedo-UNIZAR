import './styles/Header.css';
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';
import useHeader from './hooks/useHeader';
import { ROUTES } from '../../utils/constants';

const Header = ({ user, onLogout }) => {
  const { isMobile, ismenuOpened, toggleMenu, navClasses, navListClasses } = useHeader()

  const handleOnClickNav = () => {
    isMobile && toggleMenu()
  }

  return (
    <header className="header">
      <h1 className="header-title accent">Cluedo UNIZAR</h1>

      {isMobile && (
        <button className="header-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <GiHamburgerMenu size={24} />
        </button>
      )}

      {isMobile && ismenuOpened && (
        <div
          className="menu-backdrop active"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      <nav className={navClasses} onClick={handleOnClickNav}>
        <ul className={navListClasses}>
          <li className="header-nav-item"><Link to={ROUTES.HOME}>Inicio</Link></li>
          <li className="header-nav-item"><Link to={ROUTES.GAMES}>Partidas</Link></li>
          <li className="header-nav-item"><Link to={ROUTES.RULES}>Reglas</Link></li>
          {user ? (
            <>
              <li className="header-nav-item header-profile">
                <Link to={ROUTES.PROFILE}>Mi perfil</Link>
              </li>
              <li className="header-nav-item header-logout">
                <Link to={ROUTES.HOME} onClick={onLogout}>Cerrar sesión</Link>
              </li>
            </>
          ) : (
            <>
              <li className="header-nav-item header-login">
                <Link to={ROUTES.LOGIN}>Iniciar sesión</Link>
              </li>
              <li className="header-nav-item header-register">
                <Link to={ROUTES.REGISTER}>Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;