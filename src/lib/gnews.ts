import { GNewsResponse } from '@/types';

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

export async function fetchNewsByBrand(brand: string, maxResults = 20): Promise<GNewsResponse> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error('GNEWS_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    q: brand,
    lang: 'en',
    max: String(maxResults),
    apikey: apiKey,
    sortby: 'publishedAt',
  });

  const url = `${GNEWS_BASE_URL}/search?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GNews API error ${response.status}: ${errorText}`);
  }

  const data: GNewsResponse = await response.json();
  return data;
}
