import axios from "axios";
import { config } from "../Config/env";

const BASE_URL = "https://newsdata.io/api/1/latest";

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

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export async function fetchNewsByCountry(countryCode: string): Promise<NewsResponse> {
  console.log("API KEY:", config.API_KEY);
  console.log("Country:", countryCode);

  const { data } = await axios.get(BASE_URL, {
    params: {
      apikey: config.API_KEY,
      country: countryCode.toLowerCase(),
      language: "en",
      size: 10,
    },
  });

  if (data.status !== "success") {
    throw new Error(data.message ?? "NewsData.io returned an error");
  }

  return {
    status: data.status,
    totalResults: data.totalResults ?? 0,
    articles: data.results ?? [],
  };
}