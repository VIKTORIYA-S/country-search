interface RawCountry {
  name: string;
  flag: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  borders: string[];
  currencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
  languages: { name: string }[];
}

interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  borders: string[];
  currencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
  languages: string[];
}

export function mapCountryResponse(raw: RawCountry): CountryCard {
  return {
    name: raw.name,
    flag: raw.flag,
    capital: raw.capital,
    region: raw.region,
    subregion: raw.subregion,
    population: raw.population,
    area: raw.area,
    borders: raw.borders,
    currencies: raw.currencies,
    languages: raw.languages.map((language) => language.name),
  };
}
