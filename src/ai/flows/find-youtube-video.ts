
'use server';

/**
 * @fileOverview An AI agent that finds a relevant YouTube video for a given song description.
 *
 * - findYoutubeVideo - A function that takes a song description and returns a YouTube video ID and title.
 * - FindYoutubeVideoInput - The input type for the findYoutubeVideo function.
 * - FindYoutubeVideoOutput - The return type for the findYoutubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindYoutubeVideoInputSchema = z.object({
  songDescription: z.string().describe('The name of a song, optionally including the artist. For example, "Coldplay - A Sky Full of Stars".'),
});
export type FindYoutubeVideoInput = z.infer<typeof FindYoutubeVideoInputSchema>;

const FindYoutubeVideoOutputSchema = z.object({
  videoId: z.string().describe('The YouTube video ID of the found song.'),
  title: z.string().describe('The official title of the YouTube video.'),
});
export type FindYoutubeVideoOutput = z.infer<typeof FindYoutubeVideoOutputSchema>;

export async function findYoutubeVideo(
  input: FindYoutubeVideoInput
): Promise<FindYoutubeVideoOutput> {
  return findYoutubeVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findYoutubeVideoPrompt',
  input: {schema: FindYoutubeVideoInputSchema},
  output: {schema: FindYoutubeVideoOutputSchema},
  prompt: `You are a music expert with knowledge of YouTube. Your task is to find the most relevant official music video or high-quality audio for the given song description.

Return only the YouTube video ID and the video title.

Song: {{{songDescription}}}
`,
});

const findYoutubeVideoFlow = ai.defineFlow(
  {
    name: 'findYoutubeVideoFlow',
    inputSchema: FindYoutubeVideoInputSchema,
    outputSchema: FindYoutubeVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
