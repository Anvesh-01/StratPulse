import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getStrategyModel, STRATEGY_PROMPT } from '@/lib/gemini';
import { StrategyResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { brand, headline, mood, sentiment_score } = body as {
      brand: string;
      headline: string;
      mood: string;
      sentiment_score: number;
    };

    if (!brand || !headline || !mood) {
      return NextResponse.json({ error: 'brand, headline, and mood are required' }, { status: 400 });
    }

    const model = getStrategyModel();
    const prompt = STRATEGY_PROMPT(brand, headline, mood, sentiment_score ?? 0);
    const result = await model.generateContent(prompt);
    const rawJSON = result.response.text();

    const strategy: StrategyResponse = JSON.parse(rawJSON);

    return NextResponse.json(strategy);
  } catch (error) {
    console.error('[/api/strategy] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
