import { render, screen, fireEvent } from '@testing-library/react';
import FeatureCard from '../../../../src/components/home/components/FeatureCard';

describe('FeatureCard Component', () => {
  const mockProps = {
    icon: '🎮',
    iconLabel: 'Game Controller',
    title: 'Feature Title',
    description: 'Feature description text'
  };

  const scrollToSpy = jest.fn();
  beforeEach(() => {
    global.window.scrollTo = scrollToSpy;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders content correctly', () => {
    render(<FeatureCard {...mockProps} />);

    expect(screen.getByText(mockProps.icon)).toBeInTheDocument();
    expect(screen.getByLabelText(mockProps.iconLabel)).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  test('scrolls to bottom when clicked', () => {
    render(<FeatureCard {...mockProps} />);

    const card = screen.getByRole('listitem');
    fireEvent.click(card);

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  });
});