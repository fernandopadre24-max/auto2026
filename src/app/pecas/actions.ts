'use server';

import { generatePartDescription, GeneratePartDescriptionInput } from '@/ai/flows/generate-part-description';
import { suggestOptimalPrice, SuggestOptimalPriceInput } from '@/ai/flows/suggest-optimal-price';
import { revalidatePath } from 'next/cache';

export async function createPartAction(formData: FormData) {
  // TODO: Implement actual database insertion
  const data = Object.fromEntries(formData);
  console.log('Creating part with data:', data);

  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  revalidatePath('/pecas');

  return { success: true, message: 'Peça criada com sucesso!' };
}


export async function generateDescriptionAction(input: GeneratePartDescriptionInput) {
    try {
        const result = await generatePartDescription(input);
        return { description: result.description };
    } catch(e) {
        console.error(e);
        return { description: null, error: 'Failed to generate description' };
    }
}

export async function suggestPriceAction(input: SuggestOptimalPriceInput) {
    try {
        const result = await suggestOptimalPrice(input);
        return { suggestedPrice: result.suggestedPrice, reasoning: result.reasoning };
    } catch(e) {
        console.error(e);
        return { suggestedPrice: null, reasoning: null, error: 'Failed to suggest price' };
    }
}
