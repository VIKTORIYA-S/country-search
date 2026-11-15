
# Design Decisions

## 1. Request Cancellation

The application uses `AbortController` to cancel previous search requests.

When the user enters a new query, the previous request is aborted immediately. This prevents outdated responses from updating the interface.

`AbortSignal.timeout()` is used to limit request time. `AbortSignal.any()` combines the user cancellation signal and the timeout signal.

The `createLatestSearch` function ensures that only the latest search result is displayed.

## 2. Debounce

The search input uses a debounce delay of 300 milliseconds.

This delay gives the user enough time to type a country name without sending a request after every keystroke. It also reduces unnecessary API requests while keeping the search responsive.

## 3. Big O Complexity

- `debounce`: O(1) for each call, excluding the callback execution.
- `mapCountryResponse`: O(L), where L is the number of languages.
- `createLatestSearch`: O(1) for cancellation and request management, excluding the search request itself.
- Rendering country results: O(N), where N is the number of countries returned by the API.

## 4. Clean Code Decisions

- Request logic is separated from DOM manipulation.
- `searchCountries` handles API requests and HTTP errors.
- `mapCountryResponse` transforms API data into a convenient format.
- `createLatestSearch` manages request cancellation.
- `debounce` prevents unnecessary search requests.
- DOM elements are created with `document.createElement()` and text is inserted with `textContent`.
- No `innerHTML` or `insertAdjacentHTML` is used for dynamic content.
- TypeScript interfaces describe the structure of country data.
