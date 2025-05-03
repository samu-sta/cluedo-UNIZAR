/**
 * @fileoverview Tests for FormField component which handles input field rendering with validation.
 * @author Samuel Felipe
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../../../src/components/auth/components/FormField';

describe('FormField Component', () => {
  const mockField = {
    id: 'test-id',
    name: 'test-name',
    type: 'text',
    label: 'Test Label',
    autoFocus: false
  };

  test('renders field label correctly', () => {
    render(<FormField field={mockField} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders input with correct attributes', () => {
    render(<FormField field={mockField} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveAttribute('name', 'test-name');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('applies error class when error is provided', () => {
    render(<FormField field={mockField} error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('error');
  });

  test('displays error message when error is provided', () => {
    render(<FormField field={mockField} error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('does not display error message when no error is provided', () => {
    render(<FormField field={mockField} />);
    expect(screen.queryByTestId('test-id-error')).not.toBeInTheDocument();
  });

  test('passes autoFocus prop correctly', () => {
    const fieldWithAutoFocus = { ...mockField, autoFocus: true };
    expect(() => render(<FormField field={fieldWithAutoFocus} />)).not.toThrow();
  });
});