import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey:'AIzaSyAT7VF7OJi_UZElbLmrxz7aYlluBPbMBEA'})],
  model: 'googleai/gemini-2.5-flash',
});
