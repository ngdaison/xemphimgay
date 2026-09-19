import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isBrowser = typeof window !== 'undefined';

export const safeStorage = {
  get(key: string): string | null {
    if (!isBrowser) return null;
    try { return sessionStorage.getItem(key); }
    catch { return null; }
  },
  set(key: string, value: string): void {
    if (!isBrowser) return;
    try { sessionStorage.setItem(key, value); }
    catch { /* quota exceeded */ }
  },
  remove(key: string): void {
    if (!isBrowser) return;
    try { sessionStorage.removeItem(key); }
    catch { /* ignore */ }
  },
};
