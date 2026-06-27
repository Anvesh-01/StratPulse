import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchNewsByBrand } from '@/lib/gnews';
import { getSentimentModel, SENTIMENT_PROMPT } from '@/lib/gemini';
import { SentimentData, SentimentResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { brand } = body as { brand: string };

    if (!brand || typeof brand !== 'string' || brand.trim().length === 0) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    const sanitizedBrand = brand.trim().slice(0, 100);

    // Fetch news articles from GNews
    const newsData = await fetchNewsByBrand(sanitizedBrand, 20);

    if (!newsData.articles || newsData.articles.length === 0) {
      return NextResponse.json({
        error: `No news articles found for "${sanitizedBrand}". Try a different brand name.`,
      }, { status: 404 });
    }

    // Extract headlines for Gemini analysis
    const articles = newsData.articles.slice(0, 20);
    const headlines = articles.map(a => a.title);

    // Run sentiment analysis via Gemini
    const model = getSentimentModel();
    const prompt = SENTIMENT_PROMPT(headlines);
    const result = await model.generateContent(prompt);
    const rawJSON = result.response.text();

    type GeminiSentimentItem = { headline: string; sentiment_score: number; mood: 'Positive' | 'Neutral' | 'Negative' };
    const sentimentResults: GeminiSentimentItem[] = JSON.parse(rawJSON);

    // Merge GNews article metadata with Gemini sentiment scores
    const enrichedData: SentimentData[] = articles.map((article, index) => {
      const sentiment = sentimentResults[index] || {
        headline: article.title,
        sentiment_score: 0,
        mood: 'Neutral' as const,
      };
      return {
        id: uuidv4(),
        headline: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        sentiment_score: Math.max(-1, Math.min(1, sentiment.sentiment_score)),
        mood: sentiment.mood,
        image: article.image,
      };
    });

    // Calculate aggregate stats
    const avgScore = enrichedData.reduce((sum, d) => sum + d.sentiment_score, 0) / enrichedData.length;
    const moodCounts = enrichedData.reduce(
      (acc, d) => ({ ...acc, [d.mood]: (acc[d.mood] || 0) + 1 }),
      {} as Record<string, number>
    );
    const dominantMood = (Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral') as SentimentData['mood'];

    const response: SentimentResponse = {
      brand: sanitizedBrand,
      data: enrichedData,
      averageScore: avgScore,
      dominantMood,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[/api/sentiment] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
