import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../../src/components/home/Home';
import useIsMobile from '../../../src/components/common/hooks/useIsMobile';

jest.mock('../../../src/components/home/components/HeroSection', () => {
  return function MockHeroSection({ isMobile }) {
    return <div data-testid="hero-section" data-mobile={isMobile.toString()}>Hero Section</div>;
  };
});

jest.mock('../../../src/components/home/components/FeaturesSection', () => {
  return function MockFeaturesSection() {
    return <div data-testid="features-section">Features Section</div>;
  };
});

jest.mock('../../../src/components/home/components/RulesSection', () => {
  return function MockRulesSection({ isMobile }) {
    return <div data-testid="rules-section" data-mobile={isMobile.toString()}>Rules Section</div>;
  };
});

jest.mock('../../../src/components/home/components/CTASection', () => {
  return function MockCTASection() {
    return <div data-testid="cta-section">CTA Section</div>;
  };
});

jest.mock('../../../src/components/common/hooks/useIsMobile');

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Home Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  test('renders all required sections in correct order', () => {
    useIsMobile.mockReturnValue(false);
    renderWithRouter(<Home />);

    const sections = screen.getAllByTestId(/.*-section/);
    expect(sections).toHaveLength(4);

    expect(sections[0]).toHaveAttribute('data-testid', 'hero-section');
    expect(sections[1]).toHaveAttribute('data-testid', 'features-section');
    expect(sections[2]).toHaveAttribute('data-testid', 'rules-section');
    expect(sections[3]).toHaveAttribute('data-testid', 'cta-section');
  });

  test('passes isMobile prop to appropriate sections in desktop mode', () => {
    useIsMobile.mockReturnValue(false);
    renderWithRouter(<Home />);

    expect(screen.getByTestId('hero-section')).toHaveAttribute('data-mobile', 'false');
    expect(screen.getByTestId('rules-section')).toHaveAttribute('data-mobile', 'false');
  });

  test('passes isMobile prop to appropriate sections in mobile mode', () => {
    useIsMobile.mockReturnValue(true);
    renderWithRouter(<Home />);

    expect(screen.getByTestId('hero-section')).toHaveAttribute('data-mobile', 'true');
    expect(screen.getByTestId('rules-section')).toHaveAttribute('data-mobile', 'true');
  });

  test('scrolls to top of page on mount', () => {
    useIsMobile.mockReturnValue(false);
    renderWithRouter(<Home />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});