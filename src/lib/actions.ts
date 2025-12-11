
'use server'

import { analyzeUserInput } from "@/ai/flows/analyze-user-input-flow";
import { highlightPsychologicalPatterns } from "@/ai/flows/highlight-psychological-patterns-flow";

export async function performAnalysis(text: string) {
    if (!text || text.trim().length < 10) {
        throw new Error("Not enough text to analyze. Please write a bit more.");
    }
    
    try {
        const [analysisResult, highlightsResult] = await Promise.all([
            analyzeUserInput({ text }),
            highlightPsychologicalPatterns(text)
        ]);

        return {
            rawText: text,
            analysis: analysisResult,
            highlights: highlightsResult,
        };

    } catch (error) {
        console.error("Error performing AI analysis:", error);
        throw new Error("Failed to analyze the text. The AI may be unavailable. Please try again later.");
    }
}
