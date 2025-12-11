import type { AnalyzeUserInputOutput } from "@/ai/flows/analyze-user-input-flow";
import type { HighlightPsychologicalPatternsOutput } from "@/ai/flows/highlight-psychological-patterns-flow";

export type SessionData = {
  id: string;
  date: string;
  rawText: string;
  analysis: AnalyzeUserInputOutput;
  highlights: HighlightPsychologicalPatternsOutput;
  kpis: {
    cognitiveLoad: 'High' | 'Medium' | 'Low';
    sentimentScore: 'Positive' | 'Neutral' | 'Negative';
    wordCount: number;
    focusLevel: number;
  };
};

export type HistoryEntry = {
  id: string;
  date: string;
  time: string;
  snippet: string;
  emotion: 'Anxious' | 'Energetic' | 'Reflective' | 'Confused';
  color: 'orange' | 'green' | 'purple' | 'gray';
};
