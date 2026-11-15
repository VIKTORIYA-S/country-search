import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../src/mapCountryResponse';

describe('mapCountryResponse', () => {
  it('should transform raw country data into card data', () => {
    const raw = {
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      subregion: 'Southern Europe',
      population: 47400000,
      area: 505990,
      borders: ['AND', 'FRA', 'GIB', 'PRT'],
      currencies: [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      ],
      languages: [{ name: 'Spanish' }],
    };

    const result = mapCountryResponse(raw);

    expect(result).toEqual({
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      subregion: 'Southern Europe',
      population: 47400000,
      area: 505990,
      borders: ['AND', 'FRA', 'GIB', 'PRT'],
      currencies: [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      ],
      languages: ['Spanish'],
    });
  });
});
