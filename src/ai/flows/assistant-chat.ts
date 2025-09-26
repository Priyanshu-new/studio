'use server';
/**
 * @fileOverview A conversational AI assistant for students.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantChatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are logic flow ai chatbot, a friendly and knowledgeable study partner for students. Your primary goal is to help users learn, understand complex topics, and stay motivated in their studies.

Always maintain a positive, encouraging, and patient tone. When a user asks a question, provide clear, concise, and helpful answers. If the conversation strays from academic topics, gently guide it back to subjects that will help the user with their learning goals.

You are chatting with a student. Here is their message:
"{{{message}}}"

Provide a helpful and encouraging response that keeps the focus on their studies.
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
