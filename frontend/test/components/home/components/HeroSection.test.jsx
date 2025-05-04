/**
 * @fileoverview Tests for HeroSection component which displays the main landing section with call-to-action buttons.
 * @author Samuel Felipe
 */
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from '../../../../src/components/home/components/HeroSection';
import { HOME, ROUTES } from '../../../../src/utils/constants';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('HeroSection Component', () => {
  test('renders the content correctly', () => {
    renderWithRouter(<HeroSection isMobile={false} />);

    expect(screen.getByText(HOME.HERO.ASIDE)).toBeInTheDocument();

    expect(screen.getByText(HOME.HERO.TITLE)).toBeInTheDocument();
    expect(screen.getByText(HOME.HERO.BRAND)).toBeInTheDocument();
    expect(screen.getByText(HOME.HERO.DESCRIPTION)).toBeInTheDocument();

    expect(screen.getByText(HOME.HERO.REGISTER_BTN)).toBeInTheDocument();
    expect(screen.getByText(HOME.HERO.LOGIN_BTN)).toBeInTheDocument();

    const heroImage = screen.getByAltText(HOME.HERO.IMAGE_ALT);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', HOME.IMAGES.DETECTIVE);
  });

  test('displays statistics correctly', () => {
    renderWithRouter(<HeroSection isMobile={false} />);

    HOME.HERO.STATS.forEach(stat => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  test('includes links to correct routes', () => {
    renderWithRouter(<HeroSection isMobile={false} />);

    const registerLink = screen.getByText(HOME.HERO.REGISTER_BTN);
    expect(registerLink.closest('a')).toHaveAttribute('href', ROUTES.REGISTER);

    const loginLink = screen.getByText(HOME.HERO.LOGIN_BTN);
    expect(loginLink.closest('a')).toHaveAttribute('href', ROUTES.LOGIN);
  });
});