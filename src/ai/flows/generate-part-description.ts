
'use server';

/**
 * @fileOverview A flow for generating detailed descriptions of clothing products using AI.
 *
 * - generateProductDescription - A function that generates the description.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the clothing product.'),
  category: z.string().describe('The category of the product (e.g., T-shirts, Jeans, Dresses).'),
  brand: z.string().describe('The brand of the product.'),
  gender: z.string().describe('The target gender for the product (e.g., Masculino, Feminino, Unissex).'),
  color: z.string().describe('The color of the product.'),
  material: z.string().describe('The material of the product (e.g., Cotton, Polyester, Denim).'),
  size: z.string().describe('The size of the product.'),
  condition: z.string().describe('The condition of the product, e.g. new, used.'),
});

export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and professional description of the clothing product.'),
});

export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert in creating detailed and professional descriptions for clothing products.

  Using the information provided below, generate a comprehensive description of the product that can be used in an online store or catalog.
  Include relevant details to help customers make informed purchase decisions.

  Product Name: {{productName}}
  Category: {{category}}
  Brand: {{brand}}
  Gender: {{gender}}
  Color: {{color}}
  Material: {{material}}
  Size: {{size}}
  Condition: {{condition}}
  `,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);

    