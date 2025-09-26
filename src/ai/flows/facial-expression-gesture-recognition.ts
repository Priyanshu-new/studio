'use server';

/**
 * @fileOverview Recognizes facial expressions and gestures from camera input to trigger actions.
 *
 * - recognizeFacialExpressionGesture - A function that handles the facial expression and gesture recognition process.
 * - RecognizeFacialExpressionGestureInput - The input type for the recognizeFacialExpressionGesture function.
 * - RecognizeFacialExpressionGestureOutput - The return type for the recognizeFacialExpressionGesture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RecognizeFacialExpressionGestureInputSchema = z.object({
  cameraDataUri: z
    .string()
    .describe(
      "A data URI of the camera input, must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeFacialExpressionGestureInput = z.infer<
  typeof RecognizeFacialExpressionGestureInputSchema
>;

const RecognizeFacialExpressionGestureOutputSchema = z.object({
  action: z
    .string()
    .describe(
      'The action to be performed based on the recognized facial expression or gesture, e.g., play music, stop music.'
    ),
});
export type RecognizeFacialExpressionGestureOutput = z.infer<
  typeof RecognizeFacialExpressionGestureOutputSchema
>;

export async function recognizeFacialExpressionGesture(
  input: RecognizeFacialExpressionGestureInput
): Promise<RecognizeFacialExpressionGestureOutput> {
  return recognizeFacialExpressionGestureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeFacialExpressionGesturePrompt',
  input: {schema: RecognizeFacialExpressionGestureInputSchema},
  output: {schema: RecognizeFacialExpressionGestureOutputSchema},
  prompt: `You are an AI assistant that recognizes facial expressions and gestures from camera input and determines the appropriate action to perform.

  Analyze the camera input and identify any facial expressions or gestures. Based on the recognized expression or gesture, determine the appropriate action to perform within the application. For example, if the user smiles, play music. If the user raises their hand, stop the music.

  Camera Input: {{media url=cameraDataUri}}

  Respond with the action to be performed.
  `,
});

const recognizeFacialExpressionGestureFlow = ai.defineFlow(
  {
    name: 'recognizeFacialExpressionGestureFlow',
    inputSchema: RecognizeFacialExpressionGestureInputSchema,
    outputSchema: RecognizeFacialExpressionGestureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

