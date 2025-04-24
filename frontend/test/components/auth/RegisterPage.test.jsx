import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../../../src/components/auth/register/RegisterPage';

describe('RegisterPage Component', () => {
  test('renders without crashing', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      );
    }).not.toThrow();
  });
});