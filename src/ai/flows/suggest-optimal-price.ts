'use server';

/**
 * @fileOverview AI-powered optimal price suggestion flow for auto parts.
 *
 * - suggestOptimalPrice - A function that suggests an optimal sales price for an auto part.
 * - SuggestOptimalPriceInput - The input type for the suggestOptimalPrice function.
 * - SuggestOptimalPriceOutput - The return type for the suggestOptimalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalPriceInputSchema = z.object({
  partName: z.string().describe('The name of the auto part.'),
  marketData: z.string().describe('The recent market data for the auto part.'),
  competitorPricing: z.string().describe('The competitor pricing for the auto part.'),
  inventoryLevel: z.number().describe('The current inventory level of the auto part.'),
  purchasePrice: z.number().describe('The purchase price of the auto part.'),
});
export type SuggestOptimalPriceInput = z.infer<typeof SuggestOptimalPriceInputSchema>;

const SuggestOptimalPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested optimal sales price for the auto part.'),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestOptimalPriceOutput = z.infer<typeof SuggestOptimalPriceOutputSchema>;

export async function suggestOptimalPrice(input: SuggestOptimalPriceInput): Promise<SuggestOptimalPriceOutput> {
  return suggestOptimalPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalPricePrompt',
  input: {schema: SuggestOptimalPriceInputSchema},
  output: {schema: SuggestOptimalPriceOutputSchema},
  prompt: `You are an AI pricing strategist for an auto parts store. Based on the following information, suggest an optimal sales price for the auto part and explain your reasoning.\n\nPart Name: {{{partName}}}\nMarket Data: {{{marketData}}}\nCompetitor Pricing: {{{competitorPricing}}}\nInventory Level: {{{inventoryLevel}}}\nPurchase Price: {{{purchasePrice}}}\n\nSuggested Price: \nReasoning: `,
});

const suggestOptimalPriceFlow = ai.defineFlow(
  {
    name: 'suggestOptimalPriceFlow',
    inputSchema: SuggestOptimalPriceInputSchema,
    outputSchema: SuggestOptimalPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
