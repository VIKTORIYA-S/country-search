import { createLatestSearch } from './createLatestSearch';
import { debounce } from './debounce';
import { searchCountries } from './searchCountries';
import { mapCountryResponse } from './mapCountryResponse';

const container = document.createElement('main');
container.className = 'container';

const title = document.createElement('h1');
title.textContent = 'Country Search';

const subtitle = document.createElement('p');
subtitle.className = 'subtitle';
subtitle.textContent = 'Find information about any country';

const searchInput = document.createElement('input');
searchInput.className = 'search-input';
searchInput.type = 'search';
searchInput.placeholder = 'Enter a country name...';
searchInput.setAttribute('aria-label', 'Search for a country');

const message = document.createElement('p');
message.className = 'message';

const results = document.createElement('div');
results.className = 'results';

container.append(title, subtitle, searchInput, message, results);

document.body.append(container);
const search = createLatestSearch(searchCountries);

let currentQuery = '';

const performSearch = debounce(async (query: string) => {
  if (!query || query !== currentQuery) {
    return;
  }

  message.textContent = 'Loading...';

  try {
    const rawCountries = await search(query);

    if (rawCountries === null || query !== currentQuery) {
      return;
    }

    const countries = rawCountries.map((country) =>
      mapCountryResponse(country as Parameters<typeof mapCountryResponse>[0]),
    );

    results.replaceChildren();

    if (countries.length === 0) {
      message.textContent = 'No countries found.';
      return;
    }

    message.textContent = '';

    countries.forEach((country) => {
      const card = document.createElement('article');
      card.className = 'country-card';

      const name = document.createElement('h2');
      name.textContent = `${country.flag} ${country.name}`;

      const capital = document.createElement('p');
      capital.textContent = `Capital: ${country.capital}`;

      const region = document.createElement('p');
      region.textContent = `Region: ${country.region}`;

      const population = document.createElement('p');
      population.textContent = `Population: ${country.population.toLocaleString()}`;

      const languages = document.createElement('p');
      languages.textContent = `Languages: ${country.languages.join(', ')}`;

      card.append(name, capital, region, population, languages);
      results.append(card);
    });
  } catch (error) {
    if (query !== currentQuery) {
      return;
    }

    message.textContent = 'Something went wrong. Please try again.';
    console.error(error);
  }
}, 300);

searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();

  search.cancel();
  results.replaceChildren();

  if (!currentQuery) {
    message.textContent = '';
    return;
  }

  performSearch(currentQuery);
});