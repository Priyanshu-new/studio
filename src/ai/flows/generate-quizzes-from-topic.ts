'use server';
/**
 * @fileOverview Generates a quiz from a given topic.
 *
 * - generateQuizzesFromTopic - A function that generates a quiz from a given topic.
 * - GenerateQuizzesFromTopicInput - The input type for the generateQuizzesFromTopic function.
 * - GenerateQuizzesFromTopicOutput - The return type for the generateQuizzesFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizzesFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate a quiz for.'),
  numQuestions: z.number().default(5).describe('The number of questions to generate.'),
});
export type GenerateQuizzesFromTopicInput = z.infer<
  typeof GenerateQuizzesFromTopicInputSchema
>;

const GenerateQuizzesFromTopicOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizzesFromTopicOutput = z.infer<
  typeof GenerateQuizzesFromTopicOutputSchema
>;

export async function generateQuizzesFromTopic(
  input: GenerateQuizzesFromTopicInput
): Promise<GenerateQuizzesFromTopicOutput> {
  return generateQuizzesFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizzesFromTopicPrompt',
  input: {schema: GenerateQuizzesFromTopicInputSchema},
  output: {schema: GenerateQuizzesFromTopicOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with {{numQuestions}} questions on the topic of {{topic}}. The quiz should be returned as a JSON object with the following format:

{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": "",
      "explanation": ""
    }
  ]
}

Make sure that the answer is one of the options. The explanation should explain why the answer is correct.
`,
});

const generateQuizzesFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizzesFromTopicFlow',
    inputSchema: GenerateQuizzesFromTopicInputSchema,
    outputSchema: GenerateQuizzesFromTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
