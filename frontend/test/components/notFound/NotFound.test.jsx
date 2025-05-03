/**
 * @fileoverview Tests for NotFound component which displays a 404 error page when navigating to non-existent routes.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../../src/components/notFound/NotFound';
import { ROUTES } from '../../../src/utils/constants';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('NotFound Component', () => {
  test('renders 404 page correctly', () => {
    renderWithRouter(<NotFound />);

    const notFoundTitle = screen.getByText('404');
    expect(notFoundTitle).toBeInTheDocument();

    const subtitle = screen.getByText('Página no encontrada');
    expect(subtitle).toBeInTheDocument();
  });

  test('displays the informative message correctly', () => {
    renderWithRouter(<NotFound />);

    const message = screen.getByText(/Lo sentimos, la página que estás buscando parece que ha sido trasladada a otra o nunca existió./i);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('not-found-message');
  });

  test('contains a button to return to home page', () => {
    renderWithRouter(<NotFound />);

    const homeButton = screen.getByText('Volver al inicio');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveAttribute('href', ROUTES.HOME);
    expect(homeButton).toHaveClass('btn', 'primary', 'with-shadow');
  });

  test('navigates to home page when button is clicked', async () => {
    renderWithRouter(<NotFound />);

    const homeButton = screen.getByText('Volver al inicio');
    await act(async () => {
      fireEvent.click(homeButton);
    });

    expect(homeButton).toHaveAttribute('href', ROUTES.HOME);

    expect(window.location.pathname).toBe(ROUTES.HOME);
  });
});