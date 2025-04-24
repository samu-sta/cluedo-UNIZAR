import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useRegisterPage from '../../../../src/components/auth/register/hooks/useRegisterPage';

// Función auxiliar para renderizar hooks dentro de un Router
const renderHookWithRouter = (hook) => {
  const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
  return renderHook(() => hook(), { wrapper });
};

// Test básico para verificar que el hook se inicializa correctamente
describe('useRegisterPage Hook', () => {
  test('initializes without crashing', () => {
    // Ahora renderizamos el hook dentro de un Router
    try {
      renderHookWithRouter(useRegisterPage);
      // Si llegamos aquí, el test pasa
      expect(true).toBe(true);
    } catch (error) {
      // Si hay un error en la inicialización, el test fallará
      expect(error).toBeUndefined();
    }
  });
});