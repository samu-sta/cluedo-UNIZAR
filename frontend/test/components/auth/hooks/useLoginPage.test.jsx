/**
 * @fileoverview Tests for useLoginPage hook which manages login form state and validation.
 * @author Samuel Felipe
 */
import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useLoginPage from '../../../../src/components/auth/login/hooks/useLoginPage';

const renderHookWithRouter = (hook, initialProps) => {
  const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
  return renderHook(() => hook(initialProps), { wrapper });
};

describe('useLoginPage Hook', () => {
  test('initializes without crashing', () => {
    try {
      renderHookWithRouter(useLoginPage, () => { });
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});