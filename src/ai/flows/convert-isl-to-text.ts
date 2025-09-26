'use server';
/**
 * @fileOverview Converts Indian Sign Language (ISL) from camera input to English text.
 *
 * - convertISLToText - A function that handles the ISL to text conversion process.
 * - ConvertISLToTextInput - The input type for the convertISLToText function.
 * - ConvertISLToTextOutput - The return type for the convertISLToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertISLToTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of Indian Sign Language (ISL) signs, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ConvertISLToTextInput = z.infer<typeof ConvertISLToTextInputSchema>;

const ConvertISLToTextOutputSchema = z.object({
  englishText: z
    .string()
    .describe('The English text translation of the Indian Sign Language (ISL) signs in the photo.'),
});
export type ConvertISLToTextOutput = z.infer<typeof ConvertISLToTextOutputSchema>;

export async function convertISLToText(
  input: ConvertISLToTextInput
): Promise<ConvertISLToTextOutput> {
  return convertISLToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertISLToTextPrompt',
  input: {schema: ConvertISLToTextInputSchema},
  output: {schema: ConvertISLToTextOutputSchema},
  prompt: `You are an expert in Indian Sign Language (ISL).

You will receive a photo of ISL signs and your task is to translate them into English text.

Here is the photo of the ISL signs: {{media url=photoDataUri}}`,
});

const convertISLToTextFlow = ai.defineFlow(
  {
    name: 'convertISLToTextFlow',
    inputSchema: ConvertISLToTextInputSchema,
    outputSchema: ConvertISLToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
