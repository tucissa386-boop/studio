'use server';
/**
 * @fileOverview Analyzes user input text to identify psychological patterns.
 *
 * - analyzeUserInput - Analyzes user text and returns insights.
 * - AnalyzeUserInputInput - The input type for the analyzeUserInput function.
 * - AnalyzeUserInputOutput - The return type for the analyzeUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserInputInputSchema = z.object({
  text: z.string().describe('The text input from the user.'),
});
export type AnalyzeUserInputInput = z.infer<typeof AnalyzeUserInputInputSchema>;

const AnalyzeUserInputOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the user input text.'),
  patterns: z.array(z.string()).describe('Identified psychological patterns.'),
  recommendation: z.string().describe('AI-powered recommendations based on identified patterns'),
});
export type AnalyzeUserInputOutput = z.infer<typeof AnalyzeUserInputOutputSchema>;

export async function analyzeUserInput(input: AnalyzeUserInputInput): Promise<AnalyzeUserInputOutput> {
  return analyzeUserInputFlow(input);
}

const analyzeUserInputPrompt = ai.definePrompt({
  name: 'analyzeUserInputPrompt',
  input: {schema: AnalyzeUserInputInputSchema},
  output: {schema: AnalyzeUserInputOutputSchema},
  prompt: `You are a psychology expert analyzing user-provided text.

  Identify hidden insecurities, hopes, negative self-talk patterns, and other psychological insights from the text.
  List the identified psychological patterns in the patterns output field.
  Provide a recommendation based on the identified patterns in the recommendation output field.

  Text: {{{text}}} `,
});

const analyzeUserInputFlow = ai.defineFlow(
  {
    name: 'analyzeUserInputFlow',
    inputSchema: AnalyzeUserInputInputSchema,
    outputSchema: AnalyzeUserInputOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserInputPrompt(input);
    return output!;
  }
);
