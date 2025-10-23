'use server';

import {
  generatePartDescription,
  GeneratePartDescriptionInput,
} from '@/ai/flows/generate-part-description';
import {
  suggestOptimalPrice,
  SuggestOptimalPriceInput,
} from '@/ai/flows/suggest-optimal-price';
import { revalidatePath } from 'next/cache';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// This is a temporary solution to get the admin SDK working.
// In a real app, you would want to secure this properly.
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

export async function createPartAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const partData = {
      name: data.partName,
      sku: `SKU-${Date.now()}`, // Generate a simple SKU
      stock: Number(data.inventoryLevel),
      purchasePrice: Number(data.purchasePrice),
      salePrice: Number(data.salePrice),
      category: data.partCategory,
      manufacturer: data.manufacturer,
      vehicleModel: data.model,
      vehicleYear: Number(data.year),
      condition: data.condition,
      technicalSpecifications: data.technicalSpecifications,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('parts').add(partData);

    revalidatePath('/pecas');

    return { success: true, message: 'Peça criada com sucesso!' };
  } catch (error) {
    console.error('Error creating part:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: `Erro ao criar peça: ${errorMessage}` };
  }
}

export async function generateDescriptionAction(
  input: GeneratePartDescriptionInput
) {
  try {
    const result = await generatePartDescription(input);
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
