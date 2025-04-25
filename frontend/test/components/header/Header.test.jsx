import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../../../src/components/header/Header';
import useHeader from '../../../src/components/header/hooks/useHeader';

jest.mock('../../../src/components/header/hooks/useHeader');

describe('Header Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHeader = (user = null, isMobile = false) => {
    useHeader.mockImplementation(() => ({
      isMobile,
      ismenuOpened: false,
      toggleMenu: jest.fn(),
      navClasses: `header-main-nav ${isMobile ? 'mobile' : ''}`,
      navListClasses: `header-nav-list ${isMobile ? 'mobile' : ''}`,
    }));

    return render(
      <Router>
        <Header user={user} onLogout={mockLogout} />
      </Router>
    );
  };

  test('renders header title', () => {
    renderHeader();
    expect(screen.getByText('Cluedo UNIZAR')).toBeInTheDocument();
  });

  test('renders navigation links for unauthenticated users', () => {
    renderHeader();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  test('renders navigation links for authenticated users', () => {
    renderHeader({ name: 'Test User' });
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Partidas')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  test('calls onLogout when logout link is clicked', () => {
    renderHeader({ name: 'Test User' });
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders hamburger menu and toggles mobile menu visibility', () => {
    const mockToggleMenu = jest.fn();
    useHeader.mockImplementation(() => ({
      isMobile: true,
      ismenuOpened: false,
      toggleMenu: mockToggleMenu,
      navClasses: 'header-main-nav mobile',
      navListClasses: 'header-nav-list mobile',
    }));

    render(
      <Router>
        <Header user={null} onLogout={mockLogout} />
      </Router>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(mockToggleMenu).toHaveBeenCalled();
  });
});