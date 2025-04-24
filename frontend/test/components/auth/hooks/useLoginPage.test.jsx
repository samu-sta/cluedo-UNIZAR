import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useLoginPage from '../../../../src/components/auth/login/hooks/useLoginPage';

// Función auxiliar para renderizar hooks dentro de un Router
const renderHookWithRouter = (hook, initialProps) => {
  const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
  return renderHook(() => hook(initialProps), { wrapper });
};

// Test básico para verificar que el hook se inicializa correctamente
describe('useLoginPage Hook', () => {
  test('initializes without crashing', () => {
    // Ahora renderizamos el hook dentro de un Router
    try {
      renderHookWithRouter(useLoginPage, () => { });
      // Si llegamos aquí, el test pasa
      expect(true).toBe(true);
    } catch (error) {
      // Si hay un error en la inicialización, el test fallará
      expect(error).toBeUndefined();
    }
  });
});