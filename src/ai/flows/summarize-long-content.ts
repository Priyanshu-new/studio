'use server';

/**
 * @fileOverview Summarizes long content into shorter, more digestible chunks.
 *
 * - summarizeLongContent - A function that handles the summarization process.
 * - SummarizeLongContentInput - The input type for the summarizeLongContent function.
 * - SummarizeLongContentOutput - The return type for the summarizeLongContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLongContentInputSchema = z.object({
  content: z
    .string()
    .describe('The long content to be summarized, such as a research paper or article.'),
});
export type SummarizeLongContentInput = z.infer<typeof SummarizeLongContentInputSchema>;

const SummarizeLongContentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the key information in the long content.'),
  progress: z
    .string()
    .describe('A short, one-sentence summary of what has been generated.'),
});
export type SummarizeLongContentOutput = z.infer<typeof SummarizeLongContentOutputSchema>;

export async function summarizeLongContent(
  input: SummarizeLongContentInput
): Promise<SummarizeLongContentOutput> {
  return summarizeLongContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLongContentPrompt',
  input: {schema: SummarizeLongContentInputSchema},
  output: {schema: SummarizeLongContentOutputSchema},
  prompt: `Summarize the following content into shorter, more digestible chunks, so I can quickly grasp the key information. 

Content: {{{content}}}`,
});

const summarizeLongContentFlow = ai.defineFlow(
  {
    name: 'summarizeLongContentFlow',
    inputSchema: SummarizeLongContentInputSchema,
    outputSchema: SummarizeLongContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'The AI has generated a summary of the input content.',
    };
  }
);
