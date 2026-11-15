type LatestSearch = ((query: string) => Promise<unknown[] | null>) & {
  cancel: () => void;
};

export function createLatestSearch(
  searchFunction: (query: string, signal: AbortSignal) => Promise<unknown[]>,
): LatestSearch {
  let controller: AbortController | null = null;

  const search = async (query: string): Promise<unknown[] | null> => {
    controller?.abort();
    controller = new AbortController();

    const currentController = controller;

    try {
      const result = await searchFunction(query, currentController.signal);

      if (currentController !== controller) {
        return null;
      }

      return result;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return null;
      }

      throw error;
    }
  };

  search.cancel = () => {
    controller?.abort();
    controller = null;
  };

  return search;
}
