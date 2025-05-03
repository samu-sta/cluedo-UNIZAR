/**
 * @fileoverview Tests for useGameEndedModal hook which manages game completion modal state.
 * @author Samuel Felipe
 */
import { renderHook, act } from '@testing-library/react';
import useGameEndedModal from '../../../../src/components/gameRoom/hooks/useGameEndedModal';

describe('useGameEndedModal hook', () => {

  test('correctly manages game ended modal state', () => {
    const { result, rerender } = renderHook((props) => useGameEndedModal(props), {
      initialProps: 'playing'
    });

    expect(result.current.showEndedModal).toBe(false);

    rerender('ended');

    expect(result.current.showEndedModal).toBe(true);

    act(() => {
      result.current.toogleEndedModal();
    });

    expect(result.current.showEndedModal).toBe(false);
  });
});