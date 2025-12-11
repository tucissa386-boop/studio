'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven recommendations
 * based on psychological patterns identified from user typing sprints.
 *
 * - provideAiRecommendations - A function that takes psychological patterns as input and returns personalized recommendations.
 * - ProvideAiRecommendationsInput - The input type for the provideAiRecommendations function.
 * - ProvideAiRecommendationsOutput - The return type for the provideAiRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAiRecommendationsInputSchema = z.object({
  patterns: z
    .array(z.string())
    .describe('An array of psychological patterns identified from the typing sprint.'),
});
export type ProvideAiRecommendationsInput = z.infer<typeof ProvideAiRecommendationsInputSchema>;

const ProvideAiRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of personalized recommendations based on the identified patterns.'),
});
export type ProvideAiRecommendationsOutput = z.infer<typeof ProvideAiRecommendationsOutputSchema>;

export async function provideAiRecommendations(input: ProvideAiRecommendationsInput): Promise<ProvideAiRecommendationsOutput> {
  return provideAiRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAiRecommendationsPrompt',
  input: {schema: ProvideAiRecommendationsInputSchema},
  output: {schema: ProvideAiRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing personalized recommendations based on psychological patterns.

  Based on the following psychological patterns identified from the user's typing sprint, provide a list of relevant exercises and actions the user can take to improve their mental well-being.

  Psychological Patterns: {{#each patterns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const provideAiRecommendationsFlow = ai.defineFlow(
  {
    name: 'provideAiRecommendationsFlow',
    inputSchema: ProvideAiRecommendationsInputSchema,
    outputSchema: ProvideAiRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
