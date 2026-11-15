const REQUEST_TIMEOUT_MS = 10_000;

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
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const response = await fetch(
    `https://countries.dev/name/${encodeURIComponent(query)}`,
    { signal: combinedSignal },
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<unknown[]>;
}
