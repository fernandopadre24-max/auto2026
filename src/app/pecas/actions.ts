
'use server';

import {
  generateProductDescription,
  GenerateProductDescriptionInput,
} from '@/ai/flows/generate-product-description';
import {
  suggestOptimalPrice,
  SuggestOptimalPriceInput,
} from '@/ai/flows/suggest-optimal-price';

export async function generateDescriptionAction(
  input: GenerateProductDescriptionInput
) {
  try {
    const result = await generateProductDescription(input);
    return { description: result.description };
  } catch (e) {
    console.error(e);
    return { description: null, error: 'Failed to generate description' };
  }
}

export async function suggestPriceAction(input: SuggestOptimalPriceInput) {
  try {
    const result = await suggestOptimalPrice(input);
    return { suggestedPrice: result.suggestedPrice, reasoning: result.reasoning };
  } catch (e) {
    console.error(e);
    return {
      suggestedPrice: null,
      reasoning: null,
      error: 'Failed to suggest price',
    };
  }
}

    