/**
 * @fileoverview Componente de página no encontrada que se muestra cuando una ruta no existe
 * @author Samuel Felipe
 */
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import "./NotFound.css";

const NotFound = () => {

  return (
    <main className="not-found-container">
      <div className="decorative-element circle top-left" aria-hidden="true"></div>
      <div className="decorative-element dots bottom-right" aria-hidden="true"></div>

      <article className="not-found-content">
        <header className="not-found-header">
          <figure className='not-found-icon-wrapper'>
            <span className="not-found-icon">🔍</span>
          </figure>

          <h1 className="not-found-title">
            <span className='not-found-404'>404</span>
            <span className="accent">Página no encontrada</span>
          </h1>
        </header>

        <section>
          <p className="not-found-message">
            Lo sentimos, la página que estás buscando parece que ha sido trasladada a otra o nunca existió.
          </p>
          <Link to={ROUTES.HOME} className="btn primary with-shadow">
            Volver al inicio
          </Link>
        </section>

        <footer>
          <section className="not-found-clue">
            <div className="clue-card" aria-hidden="true"></div>
            <div className="clue-card" aria-hidden="true"></div>
            <div className="clue-card" aria-hidden="true"></div>
          </section>
        </footer>
      </article>
    </main>
  );
}

export default NotFound;