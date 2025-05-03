/**
 * @fileoverview Tests for useRegisterPage hook which manages registration form state and validation.
 * @author Samuel Felipe
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
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