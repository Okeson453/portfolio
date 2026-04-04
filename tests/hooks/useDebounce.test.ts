import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 300 } }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'new value', delay: 300 });
    expect(result.current).toBe('test'); // Still old value

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('new value');
  });

  it('should handle rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    rerender({ value: 'ab', delay: 300 });
    rerender({ value: 'abc', delay: 300 });
    rerender({ value: 'abcd', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('a'); // No change yet

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('abcd'); // Now changed
  });

  it('should use custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    rerender({ value: 'new', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('new');
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
