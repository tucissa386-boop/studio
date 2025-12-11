'use server';
/**
 * @fileOverview This file contains a Genkit flow that analyzes text input
 * to highlight key psychological patterns and their potential impact on behavior and relationships.
 *
 * - highlightPsychologicalPatterns -  Analyzes text for psychological patterns.
 * - HighlightPsychologicalPatternsInput - The input type for the highlightPsychologicalPatterns function.
 * - HighlightPsychologicalPatternsOutput - The return type for the highlightPsychologicalPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightPsychologicalPatternsInputSchema = z.string().describe('The text to analyze for psychological patterns.');
export type HighlightPsychologicalPatternsInput = z.infer<typeof HighlightPsychologicalPatternsInputSchema>;

const HighlightPsychologicalPatternsOutputSchema = z.object({
  patterns: z.array(
    z.object({
      pattern: z.string().describe('The identified psychological pattern.'),
      explanation: z.string().describe('An explanation of the pattern and its potential impact.'),
      example: z.string().describe('An example usage of this pattern in the text provided'),
    })
  ).describe('A list of identified psychological patterns and their explanations.'),
});
export type HighlightPsychologicalPatternsOutput = z.infer<typeof HighlightPsychologicalPatternsOutputSchema>;

export async function highlightPsychologicalPatterns(input: HighlightPsychologicalPatternsInput): Promise<HighlightPsychologicalPatternsOutput> {
  return highlightPsychologicalPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightPsychologicalPatternsPrompt',
  input: {schema: HighlightPsychologicalPatternsInputSchema},
  output: {schema: HighlightPsychologicalPatternsOutputSchema},
  prompt: `Analyze the following text for key psychological patterns.

Text: {{{$input}}}

Identify any recurring themes, thought patterns, or emotional expressions that might reveal insights into the author's subconscious.

For each identified pattern, provide:
- A brief name for the pattern.
- An explanation of how this pattern might influence the author's behavior and relationships.
- An example from the provided text.

Return the results as a JSON array of objects, where each object represents a pattern and includes the name, explanation, and example.
Ensure that the explanation is clear, concise, and avoids jargon.

Your analysis should focus on providing actionable insights that the author can use to better understand themselves.

Example output format:
{
  "patterns": [
    {
      "pattern": "Self-Criticism",
      "explanation": "This pattern reflects a tendency to focus on personal flaws and shortcomings, which can lead to low self-esteem and anxiety in social situations.",
      "example": "I just don't know if I'm good enough to handle this."
    },
    {
      "pattern": "Victim Mindset",
      "explanation": "This pattern suggests a belief that external forces control one's life, leading to feelings of helplessness and a reluctance to take responsibility for personal outcomes.",
      "example": "Why is this always happening to me?"
    }
  ]
}`,
});

const highlightPsychologicalPatternsFlow = ai.defineFlow(
  {
    name: 'highlightPsychologicalPatternsFlow',
    inputSchema: HighlightPsychologicalPatternsInputSchema,
    outputSchema: HighlightPsychologicalPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
