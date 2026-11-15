import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchCountries, HttpError } from '../src/searchCountries';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchCountries', () => {
  it('should return countries when the response is successful', async () => {
    const countries = [{ name: { common: 'Spain' } }];

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(countries), { status: 200 }),
        ),
    );

    const result = await searchCountries('Spain', new AbortController().signal);

    expect(result).toEqual(countries);
  });

  it('should return an empty array when the response status is 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    const result = await searchCountries(
      'Unknown',
      new AbortController().signal,
    );

    expect(result).toEqual([]);
  });

  it('should throw HttpError for other unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    await expect(
      searchCountries('Spain', new AbortController().signal),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
