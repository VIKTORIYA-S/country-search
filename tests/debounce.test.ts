import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../src/debounce';

describe('debounce', () => {
  it('should call the function after the specified delay', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 500);

    debouncedCallback();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
