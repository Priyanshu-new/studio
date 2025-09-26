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
      'The action to be performed based on the recognized facial expression or gesture. Possible values are "happy", "stress", "fear", or "stop".'
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
  prompt: `You are an AI assistant that recognizes facial expressions and gestures from camera input. Your task is to determine the user's emotional state and map it to a specific action.

Analyze the image from the camera and identify the user's primary facial expression or gesture. Based on what you see, choose one of the following actions:

- "happy": If the user is clearly smiling or laughing.
- "stress": If the user appears stressed, worried, or anxious (e.g., furrowed brow, tense face).
- "fear": If the user looks scared or frightened (e.g., wide eyes, open mouth).
- "stop": If the user is holding up their hand in a "stop" gesture.

If no clear emotion or gesture is detected, you can default to a neutral or non-actionable response, but for this task, please prioritize identifying one of the key actions.

Camera Input: {{media url=cameraDataUri}}

Respond with a single action word that best describes the detected emotion or gesture.
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
