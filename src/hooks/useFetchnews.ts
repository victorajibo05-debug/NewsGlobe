import { useState, useCallback } from "react";

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image_url: string | null;
  source_id: string;
  source_name: string | null;
  pubDate: string;
  country: string[];
  category: string[];
  language: string;
}

interface UseFetchNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  fetchNewsByCountry: (countryCode: string) => Promise<void>;
  clear: () => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function useFetchNews(): UseFetchNewsResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsByCountry = useCallback(async (countryCode: string) => {
    console.log("Fetching news for:", countryCode);
    setLoading(true);
    setError(null);
    setArticles([]);

    try {
      const res = await fetch(`${BASE_URL}/api/news/${countryCode}`);
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.message ?? `HTTP ${res.status}`);
      }

      setArticles(data.articles ?? []);
    } catch (err) {
      console.log("Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setArticles([]);
    setError(null);
  }, []);

  return { articles, loading, error, fetchNewsByCountry, clear };
}