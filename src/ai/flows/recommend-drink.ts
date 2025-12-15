// src/ai/flows/recommend-drink.ts
'use server';
/**
 * @fileOverview A flow that recommends a drink based on the weather and time of day.
 *
 * - recommendDrink - A function that handles the drink recommendation process.
 * - RecommendDrinkInput - The input type for the recommendDrink function.
 * - RecommendDrinkOutput - The return type for the recommendDrink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendDrinkInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  timeOfDay: z.string().describe('The current time of day (Morning, Afternoon, Evening).'),
  userTaste: z.string().describe('The user\u2019s preferred taste profile.'),
});
export type RecommendDrinkInput = z.infer<typeof RecommendDrinkInputSchema>;

const RecommendDrinkOutputSchema = z.object({
  title: z.string().describe('The title of the recommendation.'),
  reason: z.string().describe('The reason for the recommendation.'),
  drink: z.string().describe('The recommended drink.'),
});
export type RecommendDrinkOutput = z.infer<typeof RecommendDrinkOutputSchema>;

export async function recommendDrink(input: RecommendDrinkInput): Promise<RecommendDrinkOutput> {
  return recommendDrinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDrinkPrompt',
  input: {schema: RecommendDrinkInputSchema},
  output: {schema: RecommendDrinkOutputSchema},
  prompt: `You are a Starbucks barista expert. Based on the weather (temperature in Celsius), time of day, and user's taste preferences, recommend a drink from Starbucks.

Weather: {{{temperature}}}°C
Time of Day: {{{timeOfDay}}}
User Taste: {{{userTaste}}}

Consider these factors when making your recommendation:
- Hot drinks are generally preferred in the morning and evening, and when the weather is cold.
- Cold and refreshing drinks are generally preferred in the afternoon, and when the weather is hot.
- Take into account the user's taste preferences when choosing a drink.
- Select the title and reason to be appropriate for the recommendation and the conditions.

Output in JSON format.`,
});

const recommendDrinkFlow = ai.defineFlow(
  {
    name: 'recommendDrinkFlow',
    inputSchema: RecommendDrinkInputSchema,
    outputSchema: RecommendDrinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
