import { useCallback, useState } from "react";

interface FetchOptions extends RequestInit {
  url: string;
  skipJson?: boolean;
}

interface UseFetchResult<T> {
  loading: boolean;
  error: string | null;
  request: (options: FetchOptions) => Promise<T>;
}

export function useFetch<T>(): UseFetchResult<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (options: FetchOptions): Promise<T> => {
    const { url, skipJson, ...fetchOptions } = options;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || response.statusText);
      }

      if (skipJson) {
        return (await response.text()) as unknown as T;
      }

      return (await response.json()) as T;
    } 
    catch (err) {
      const message = err instanceof Error ? err.message : "Fetch error";
      setError(message);
      return Promise.reject(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
}
