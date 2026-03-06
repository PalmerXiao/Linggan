export interface Quote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "linggan_quotes_v1";

function isTauri(): boolean {
  return "__TAURI_IPC__" in window;
}

type TauriQuote = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

async function tauriInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const mod = await import("@tauri-apps/api/core");
  return mod.invoke<T>(cmd, args);
}

export async function loadQuotes(): Promise<Quote[]> {
  if (isTauri()) {
    try {
      const quotes = await tauriInvoke<TauriQuote[]>("load_quotes");
      return quotes.map((q) => ({
        id: q.id,
        content: q.content,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
      }));
    } catch {
      return [];
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Quote[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function saveQuotes(quotes: Quote[]): Promise<void> {
  if (isTauri()) {
    try {
      await tauriInvoke<void>("save_quotes", {
        quotes: quotes.map((q) => ({
          id: q.id,
          content: q.content,
          created_at: q.createdAt,
          updated_at: q.updatedAt,
        })),
      });
      return;
    } catch {
      // fall through to localStorage
    }
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch {
    // ignore
  }
}

