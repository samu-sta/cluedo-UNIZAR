import './styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-credits">
        Hecho por Samuel Felipe y Daniel Sanagustin.
      </p>
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} Cluedo UNIZAR. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;