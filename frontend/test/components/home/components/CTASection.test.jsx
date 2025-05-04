/**
 * @fileoverview Tests for CTASection component which displays call-to-action elements for user registration.
 * @author Samuel Felipe
 */
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CTASection from '../../../../src/components/home/components/CTASection';
import { HOME, ROUTES } from '../../../../src/utils/constants';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CTASection Component', () => {
  test('renders title and description correctly', () => {
    renderWithRouter(<CTASection />);

    expect(screen.getByText(HOME.CTA.TITLE)).toBeInTheDocument();
    expect(screen.getByText(HOME.CTA.DESCRIPTION)).toBeInTheDocument();
  });

  test('renders call-to-action button with correct text and link', () => {
    renderWithRouter(<CTASection />);

    const ctaButton = screen.getByText(HOME.CTA.BUTTON);
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.closest('a')).toHaveAttribute('href', ROUTES.REGISTER);
    expect(ctaButton.closest('a')).toHaveClass('btn primary large with-shadow pulse');
  });

  test('renders note text', () => {
    renderWithRouter(<CTASection />);

    expect(screen.getByText(HOME.CTA.NOTE)).toBeInTheDocument();
  });
});