import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDCNubA08uqMYrH3nML8ECsa_KO46Jkn0A'})],
  model: 'googleai/gemini-2.5-flash',
});
