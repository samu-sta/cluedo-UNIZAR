import React from 'react';
import { render, screen } from '@testing-library/react';
import CharacterBadge from '../../../src/components/common/CharacterBadge';

describe('CharacterBadge Component', () => {
  const mockCharacter = {
    name: 'Colonel Mustard',
    colorHex: '#E4A81D',
    textColorHex: '#000000'
  };

  test('renders character name correctly', () => {
    render(<CharacterBadge character={mockCharacter} />);
    expect(screen.getByText('Colonel Mustard')).toBeInTheDocument();
  });

  test('applies correct background color and text color', () => {
    render(<CharacterBadge character={mockCharacter} />);
    const badge = screen.getByText('Colonel Mustard');
    const badgeStyle = window.getComputedStyle(badge);

    expect(badgeStyle.backgroundColor).toBe('rgb(228, 168, 29)');
    expect(badgeStyle.color).toBe('rgb(0, 0, 0)');
  });

  test('renders nothing when character prop is not provided', () => {
    const { container } = render(<CharacterBadge />);
    expect(container.firstChild).toBeNull();
  });

  test('uses default colors when color props are missing', () => {
    const characterWithoutColors = {
      name: 'Miss Scarlet'
    };
    render(<CharacterBadge character={characterWithoutColors} />);
    const badge = screen.getByText('Miss Scarlet');
    const badgeStyle = window.getComputedStyle(badge);

    expect(badgeStyle.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(badgeStyle.color).toBe('rgb(255, 255, 255)');
  });

  test('has correct CSS class', () => {
    render(<CharacterBadge character={mockCharacter} />);
    const badge = screen.getByText('Colonel Mustard');
    expect(badge).toHaveClass('character-badge');
  });
});