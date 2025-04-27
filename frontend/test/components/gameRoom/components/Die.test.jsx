import React from 'react';
import { render, screen } from '@testing-library/react';
import Die from '../../../../src/components/gameRoom/components/Die';

describe('Die component', () => {
  test('renders with correct number of dots for value 1', () => {
    render(<Die value={1} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(2);

    expect(dots[1]).toHaveClass('dot-1-1');
  });

  test('renders with correct number of dots for value 2', () => {
    render(<Die value={2} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(3);

    expect(dots[1]).toHaveClass('dot-2-1');
    expect(dots[2]).toHaveClass('dot-2-2');
  });

  test('renders with correct number of dots for value 3', () => {
    render(<Die value={3} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(4);

    expect(dots[1]).toHaveClass('dot-3-1');
    expect(dots[2]).toHaveClass('dot-3-2');
    expect(dots[3]).toHaveClass('dot-3-3');
  });

  test('renders with correct number of dots for value 4', () => {
    render(<Die value={4} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(5);

    expect(dots[1]).toHaveClass('dot-4-1');
    expect(dots[2]).toHaveClass('dot-4-2');
    expect(dots[3]).toHaveClass('dot-4-3');
    expect(dots[4]).toHaveClass('dot-4-4');
  });

  test('renders with correct number of dots for value 5', () => {
    render(<Die value={5} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(6);

    expect(dots[1]).toHaveClass('dot-5-1');
    expect(dots[2]).toHaveClass('dot-5-2');
    expect(dots[3]).toHaveClass('dot-5-3');
    expect(dots[4]).toHaveClass('dot-5-4');
    expect(dots[5]).toHaveClass('dot-5-5');
  });

  test('renders with correct number of dots for value 6', () => {
    render(<Die value={6} />);

    const dots = screen.getAllByRole('figure');
    expect(dots).toHaveLength(7);

    expect(dots[1]).toHaveClass('dot-6-1');
    expect(dots[2]).toHaveClass('dot-6-2');
    expect(dots[3]).toHaveClass('dot-6-3');
    expect(dots[4]).toHaveClass('dot-6-4');
    expect(dots[5]).toHaveClass('dot-6-5');
    expect(dots[6]).toHaveClass('dot-6-6');
  });
});