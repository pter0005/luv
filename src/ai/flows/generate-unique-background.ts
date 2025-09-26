// A flow that generates a unique, personalized background for a relationship page using generative AI.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a unique, personalized background
 * for a relationship page using generative AI.
 *
 * - `generateUniqueBackground`: A function that takes a description of the desired background
 *   and returns a data URI representing the generated image.
 * - `GenerateUniqueBackgroundInput`: The input type for the `generateUniqueBackground` function,
 *   containing the background description.
 * - `GenerateUniqueBackgroundOutput`: The output type for the `generateUniquebBackground` function,
 *   containing the data URI of the generated image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUniqueBackgroundInputSchema = z.object({
  backgroundDescription: z
    .string()
    .describe(
      'A detailed description of the desired background, including colors, themes, and elements.'
    ),
});
export type GenerateUniqueBackgroundInput = z.infer<
  typeof GenerateUniqueBackgroundInputSchema
>;

const GenerateUniqueBackgroundOutputSchema = z.object({
  backgroundImageDataUri: z
    .string()
    .describe(
      'A data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'. This represents the generated background image.'
    ),
});
export type GenerateUniqueBackgroundOutput = z.infer<
  typeof GenerateUniqueBackgroundOutputSchema
>;

export async function generateUniqueBackground(
  input: GenerateUniqueBackgroundInput
): Promise<GenerateUniqueBackgroundOutput> {
  return generateUniqueBackgroundFlow(input);
}

const generateUniqueBackgroundPrompt = ai.definePrompt({
  name: 'generateUniqueBackgroundPrompt',
  input: {schema: GenerateUniqueBackgroundInputSchema},
  output: {schema: GenerateUniqueBackgroundOutputSchema},
  prompt: `Generate a unique and personalized background image based on the following description:

Description: {{{backgroundDescription}}}

Please return the image as a data URI in the following format: data:<mimetype>;base64,<encoded_data>.`,
});

const generateUniqueBackgroundFlow = ai.defineFlow(
  {
    name: 'generateUniqueBackgroundFlow',
    inputSchema: GenerateUniqueBackgroundInputSchema,
    outputSchema: GenerateUniqueBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.backgroundDescription,
    });
    if (!media?.url) {
      throw new Error('Failed to generate background image.');
    }
    return {backgroundImageDataUri: media.url};
  }
);
