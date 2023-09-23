import { type Fetcher } from "swr";

export function fetcher(opts?: RequestInit) {
  return async function <T>(url: string): Promise<T> {
    const res = await fetch(url, opts);
    return res.json();
  };
}
