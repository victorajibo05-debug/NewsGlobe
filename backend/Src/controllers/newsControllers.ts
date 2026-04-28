import { Request, Response } from "express";
import { fetchNewsByCountry } from "../services/newsServices";

export async function getNewsByCountry(req: Request, res: Response): Promise<void> {
  console.log("Controller hit"); 
  console.log("Country code:", req.params.countryCode);
  const { countryCode } = req.params;

  if (!countryCode || countryCode.length !== 2) {
    res.status(400).json({ message: "Invalid country code. Must be a 2-letter ISO code (e.g. 'us', 'ng')." });
    return;
  }

  try {
    const news = await fetchNewsByCountry(countryCode as any);
    res.status(200).json(news);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch news";
    res.status(500).json({ message });
  }
}