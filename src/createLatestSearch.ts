export function createLatestSearch(
  searchFunction: (query: string, signal: AbortSignal) => Promise<unknown[]>,
) {
  let controller: AbortController | null = null;

  return async (query: string): Promise<unknown[] | null> => {
    // Отменяем предыдущий запрос.
    controller?.abort();

    // Создаём новый контроллер.
    controller = new AbortController();

    const currentController = controller;

    try {
      const result = await searchFunction(query, currentController.signal);

      // Проверяем, что запрос всё ещё актуален.
      if (currentController !== controller) {
        return null;
      }

      return result;
    } catch (error) {
      // Отмена запроса не считается ошибкой.
      if ((error as Error).name === 'AbortError') {
        return null;
      }

      throw error;
    }
  };
}
