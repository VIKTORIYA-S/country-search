import { describe, it, expect, vi, afterEach } from 'vitest';
import { createLatestSearch } from '../src/createLatestSearch';
import { searchCountries } from '../src/searchCountries';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('race condition', () => {
  it('should cancel the previous request and keep only the latest result', async () => {
    const pendingRequests: (() => void)[] = [];

    const fetchMock = vi.fn(
      (_url: string | URL | Request, options?: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          const signal = options?.signal;

          signal?.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Request aborted', 'AbortError'));
            },
            { once: true },
          );

          pendingRequests.push(() => {
            resolve(
              new Response(JSON.stringify([{ name: 'Spain' }]), {
                status: 200,
              }),
            );
          });
        }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const search = createLatestSearch(searchCountries);

    const firstRequest = search('sp');
    const secondRequest = search('spain');

    expect(fetchMock).toHaveBeenCalledTimes(2);

    pendingRequests[1]?.();

    const [firstResult, secondResult] = await Promise.all([
      firstRequest,
      secondRequest,
    ]);

    expect(firstResult).toBeNull();
    expect(secondResult).toEqual([{ name: 'Spain' }]);
  });
});
