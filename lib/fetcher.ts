import { type Fetcher } from "swr";

export function fetcher(opts?: RequestInit) {
  return async function <T>(url: string): Promise<T> {
    const res = await fetch(url, opts);

    if (!res.ok) {
      throw new Error(
        "Un error ha ocurrido mientras se obtenía la información"
      );
    }

    return res.json();
  };
}
