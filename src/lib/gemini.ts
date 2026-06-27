import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getSentimentModel() {
  return getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            headline: { type: SchemaType.STRING },
            sentiment_score: { type: SchemaType.NUMBER },
            mood: {
              type: SchemaType.STRING,
              format: 'enum',
              enum: ['Positive', 'Neutral', 'Negative'],
            },
          },
          required: ['headline', 'sentiment_score', 'mood'],
        },
      },
    },
  });
}

export function getStrategyModel() {
  return getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          summary: { type: SchemaType.STRING },
          urgency: {
            type: SchemaType.STRING,
            format: 'enum',
            enum: ['Low', 'Medium', 'High', 'Critical'],
          },
          smart_goal: {
            type: SchemaType.OBJECT,
            properties: {
              specific: { type: SchemaType.STRING },
              measurable: { type: SchemaType.STRING },
              achievable: { type: SchemaType.STRING },
              relevant: { type: SchemaType.STRING },
              timeBound: { type: SchemaType.STRING },
            },
            required: ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'],
          },
          social_copy: {
            type: SchemaType.OBJECT,
            properties: {
              twitter: { type: SchemaType.STRING },
              linkedin: { type: SchemaType.STRING },
              instagram: { type: SchemaType.STRING },
            },
            required: ['twitter', 'linkedin', 'instagram'],
          },
          recommended_actions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ['summary', 'urgency', 'smart_goal', 'social_copy', 'recommended_actions'],
      },
    },
  });
}

export const SENTIMENT_PROMPT = (headlines: string[]) => `
You are a brand sentiment analyst. Analyze each of the following news headlines about a brand.

For each headline, assign:
- sentiment_score: a float from -1.0 (very negative) to 1.0 (very positive), with 0 being neutral
- mood: exactly one of "Positive", "Neutral", or "Negative"

Be precise. Controversial or neutral-sounding headlines should score near 0.

Headlines:
${headlines.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

Return a JSON array with one object per headline in the exact order provided.
`;

export const STRATEGY_PROMPT = (brand: string, headline: string, mood: string, score: number) => `
You are a senior digital marketing strategist for ${brand}.

A critical news story has been detected with a ${mood} sentiment (score: ${score.toFixed(2)}):
"${headline}"

Your job is to craft an immediate crisis/opportunity response. Generate:

1. A SMART goal (Specific, Measurable, Achievable, Relevant, Time-Bound) to address this story
2. Platform-specific social media copy (Twitter/X ≤280 chars, LinkedIn professional tone ≤500 chars, Instagram engaging with 3-5 hashtags)
3. 3-5 concrete recommended actions the marketing team should take immediately
4. An urgency level: Low, Medium, High, or Critical
5. A one-sentence executive summary

Be specific, actionable, and brand-aware. Avoid generic advice.
`;
