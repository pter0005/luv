'use server';

/**
 * @fileOverview An AI agent that suggests sentiment enhancements for a given text.
 *
 * - suggestSentimentEnhancements - A function that handles the sentiment enhancement process.
 * - SuggestSentimentEnhancementsInput - The input type for the suggestSentimentEnhancements function.
 * - SuggestSentimentEnhancementsOutput - The return type for the suggestSentimentEnhancements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSentimentEnhancementsInputSchema = z.object({
  text: z.string().describe('The text to enhance with more heartfelt and emotional expressions.'),
});
export type SuggestSentimentEnhancementsInput = z.infer<typeof SuggestSentimentEnhancementsInputSchema>;

const SuggestSentimentEnhancementsOutputSchema = z.object({
  enhancedText: z.string().describe('The text enhanced with more heartfelt and emotional expressions.'),
});
export type SuggestSentimentEnhancementsOutput = z.infer<typeof SuggestSentimentEnhancementsOutputSchema>;

export async function suggestSentimentEnhancements(
  input: SuggestSentimentEnhancementsInput
): Promise<SuggestSentimentEnhancementsOutput> {
  return suggestSentimentEnhancementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSentimentEnhancementsPrompt',
  input: {schema: SuggestSentimentEnhancementsInputSchema},
  output: {schema: SuggestSentimentEnhancementsOutputSchema},
  prompt: `You are an AI expert in sentiment analysis and text enhancement. Your task is to analyze the given text and suggest improvements to make it more heartfelt and emotional. Please provide an enhanced version of the text that conveys deeper emotions and sincerity.

Original Text: {{{text}}}

Enhanced Text:`,
});

const suggestSentimentEnhancementsFlow = ai.defineFlow(
  {
    name: 'suggestSentimentEnhancementsFlow',
    inputSchema: SuggestSentimentEnhancementsInputSchema,
    outputSchema: SuggestSentimentEnhancementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
