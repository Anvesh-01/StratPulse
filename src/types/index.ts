// StratPulse – Shared TypeScript Interfaces

export type SentimentMood = 'Positive' | 'Neutral' | 'Negative';

export interface SentimentData {
  id: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment_score: number; // -1.0 to 1.0
  mood: SentimentMood;
  image?: string;
}

export interface SentimentResponse {
  brand: string;
  data: SentimentData[];
  averageScore: number;
  dominantMood: SentimentMood;
  analyzedAt: string;
}

export interface SmartGoal {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

export interface StrategyResponse {
  smart_goal: SmartGoal;
  social_copy: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  recommended_actions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}
