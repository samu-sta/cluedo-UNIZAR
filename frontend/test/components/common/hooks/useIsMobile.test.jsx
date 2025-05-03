/**
 * @fileoverview Tests for useIsMobile hook which detects if the current viewport is mobile-sized.
 * @author Samuel Felipe
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useIsMobile from '../../../../src/components/common/hooks/useIsMobile';

describe('useIsMobile Hook', () => {
  const originalInnerWidth = window.innerWidth;

  const simulateResize = (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  test('returns true when window width is less than default threshold', () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    act(() => {
      window.dispatchEvent(new Event('load'));
    });

    expect(result.current).toBe(true);
  });

  test('returns false when window width is greater than default threshold', () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    act(() => {
      window.dispatchEvent(new Event('load'));
    });

    expect(result.current).toBe(false);
  });

  test('updates state when window is resized', () => {
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      simulateResize(500);
    });

    expect(result.current).toBe(true);

    act(() => {
      simulateResize(1024);
    });

    expect(result.current).toBe(false);
  });

  test('accepts custom width threshold', () => {
    const customWidth = 600;
    window.innerWidth = 650;

    const { result } = renderHook(() => useIsMobile(customWidth));

    expect(result.current).toBe(false);

    act(() => {
      simulateResize(550);
    });

    expect(result.current).toBe(true);
  });
});