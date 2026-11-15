import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchCountries } from '../src/searchCountries';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request errors', () => {
  it('should preserve AbortError', async () => {
    const error = new DOMException('Request aborted', 'AbortError');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));

    await expect(
      searchCountries('Spain', new AbortController().signal),
    ).rejects.toHaveProperty('name', 'AbortError');
  });

  it('should preserve TimeoutError', async () => {
    const error = new DOMException('Request timed out', 'TimeoutError');

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));

    await expect(
      searchCountries('Spain', new AbortController().signal),
    ).rejects.toHaveProperty('name', 'TimeoutError');
  });

  it('should combine the provided signal with a timeout signal', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));

    vi.stubGlobal('fetch', fetchMock);

    const signal = new AbortController().signal;

    await searchCountries('Spain', signal);

    const requestSignal = fetchMock.mock.calls[0]?.[1]?.signal;

    expect(requestSignal).not.toBe(signal);
  });
});
