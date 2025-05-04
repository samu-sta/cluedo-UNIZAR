/*************************************************
 * Pruebas para la página de registro
 * 
 * Verifica el funcionamiento correcto de la página
 * de registro, incluyendo la validación de formularios,
 * manejo de errores y redirección tras el registro.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from '../../../src/components/auth/register/RegisterPage';

describe('RegisterPage Component - Integration Test', () => {
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

  const mockResponse = {
    success: true
  };

  test('renders without crashing', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <RegisterPage registerUser={() => { }} />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  test('render form with two fields, a submit button and a link to register', () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <RegisterPage registerUser={() => { }} />
      </BrowserRouter>
    );

    expect(getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(getByLabelText('Contraseña')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Inicia sesión' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  test('check validation error messages with real form validation', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <BrowserRouter>
        <RegisterPage registerUser={() => { }} />
      </BrowserRouter>
    );
    const usernameInput = getByLabelText('Nombre de usuario');
    const emailInput = getByLabelText('Correo electrónico');
    const passwordInput = getByLabelText('Contraseña');
    const confirmPasswordInput = getByLabelText('Confirmar contraseña');
    const submitButton = getByRole('button', { name: 'Crear cuenta' });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(await findByText('El nombre de usuario debe tener al menos 3 caracteres')).toBeInTheDocument();
    expect(await findByText('Formato de email inválido')).toBeInTheDocument();
    expect(await findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    expect(await findByText('La confirmación de contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'userexample.com' } });
      fireEvent.change(usernameInput, { target: { value: 'pa' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });
      fireEvent.click(submitButton);
    });

    expect(await findByText('El nombre de usuario debe tener al menos 3 caracteres')).toBeInTheDocument();
    expect(await findByText('Formato de email inválido')).toBeInTheDocument();
    expect(await findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    expect(await findByText('La confirmación de contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();


    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
      fireEvent.click(submitButton);
    });

    expect(await findByText('El nombre de usuario debe tener al menos 3 caracteres')).toBeInTheDocument();
  });

  test('check register success using real components', async () => {
    const mockRegisterUser = jest.fn().mockResolvedValue(mockResponse);

    // Creamos componente Login para redirección
    const LoginPage = () => <div>Login Page</div>;

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage registerUser={mockRegisterUser} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Nombre de usuario');
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña');
    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'user123' } });
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    expect(mockRegisterUser).toHaveBeenCalledWith({
      username: 'user123',
      email: 'user@example.com',
      password: 'password123'
    });
  });
});