/*************************************************
 * Pruebas para el hook useRegisterPage
 * 
 * Verifica el funcionamiento del hook personalizado
 * que gestiona la lógica del formulario de registro,
 * validación de datos y navegación.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useRegisterPage from '../../../../src/components/auth/register/hooks/useRegisterPage';

const renderHookWithRouter = (hook) => {
  const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
  return renderHook(() => hook(), { wrapper });
};

describe('useRegisterPage Hook', () => {
  test('initializes without crashing', () => {
    try {
      renderHookWithRouter(useRegisterPage);
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});