export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP error: ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<unknown[]> {
  const response = await fetch(
    `https://countries.dev/name/${encodeURIComponent(query)}`,
    { signal },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<unknown[]>;
}
