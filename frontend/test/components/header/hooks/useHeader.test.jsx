/*************************************************
 * Pruebas para el hook useHeader
 * 
 * Verifica el funcionamiento del hook que gestiona
 * el comportamiento responsivo del encabezado,
 * incluyendo el menú móvil y sus estados.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

import { renderHook, act } from '@testing-library/react';
import useHeader from '../../../../src/components/header/hooks/useHeader';
import useIsMobile from '../../../../src/components/common/hooks/useIsMobile';

jest.mock('../../../../src/components/common/hooks/useIsMobile');

describe('useHeader Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default values for desktop', () => {
    useIsMobile.mockReturnValue(false);

    const { result } = renderHook(() => useHeader());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.ismenuOpened).toBe(false);
    expect(result.current.navClasses).toBe('header-main-nav  ');
    expect(result.current.navListClasses).toBe('header-nav-list ');
  });

  test('should initialize with correct default values for mobile', () => {
    useIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useHeader());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.ismenuOpened).toBe(false);
    expect(result.current.navClasses).toBe('header-main-nav mobile ');
    expect(result.current.navListClasses).toBe('header-nav-list mobile');
  });

  test('should toggle menu state on toggleMenu call', () => {
    useIsMobile.mockReturnValue(true);

    const { result } = renderHook(() => useHeader());

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.ismenuOpened).toBe(true);
    expect(result.current.navClasses).toContain('open');

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.ismenuOpened).toBe(false);
    expect(result.current.navClasses).not.toContain('open');
  });

  test('should close menu when switching to desktop view', () => {
    const { result, rerender } = renderHook(() => useHeader());

    useIsMobile.mockReturnValue(true);
    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.ismenuOpened).toBe(true);

    useIsMobile.mockReturnValue(false);
    rerender();

    expect(result.current.ismenuOpened).toBe(false);
  });
});