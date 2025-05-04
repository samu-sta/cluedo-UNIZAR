/*************************************************
 * Pruebas para la página de inicio de sesión
 * 
 * Verifica el funcionamiento correcto de la página
 * de login, incluyendo la validación de formularios,
 * manejo de errores y redirección tras inicio de sesión.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../../src/components/auth/login/LoginPage';

describe('LoginPage Component - Integration Test', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    password: 'password123'
  };

  const mockResponse = {
    success: true,
    user: mockUser
  };

  test('renders without crashing', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <LoginPage setUser={() => { }} loginUser={() => { }} />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  test('render form with two fields, a submit button and a link to register', () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <LoginPage setUser={() => { }} loginUser={() => { }} />
      </BrowserRouter>
    );

    expect(getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(getByLabelText('Contraseña')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Regístrate' })).toBeInTheDocument();
  });

  test('check validation error messages with real form validation', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <BrowserRouter>
        <LoginPage setUser={() => { }} loginUser={() => { }} />
      </BrowserRouter>
    );

    const emailInput = getByLabelText('Correo electrónico');
    const passwordInput = getByLabelText('Contraseña');
    const submitButton = getByRole('button', { name: 'Iniciar sesión' });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(await findByText('Formato de email inválido')).toBeInTheDocument();
    expect(await findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitButton);
    });

    expect(await findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(submitButton);
    });

    expect(await findByText('Formato de email inválido')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'pa' } });
      fireEvent.click(submitButton);
    });

    expect(await findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });

  test('check login success using real components', async () => {
    const mockSetUser = jest.fn();
    const mockLoginUser = jest.fn().mockResolvedValue(mockResponse);

    const HomePage = () => <div>Home Page</div>;

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={mockSetUser} loginUser={mockLoginUser} />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123'
    });
  });
});