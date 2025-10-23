'use server';

/**
 * @fileOverview A flow for generating detailed descriptions of auto parts using AI.
 *
 * - generatePartDescription - A function that generates the description.
 * - GeneratePartDescriptionInput - The input type for the generatePartDescription function.
 * - GeneratePartDescriptionOutput - The return type for the generatePartDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePartDescriptionInputSchema = z.object({
  partName: z.string().describe('The name of the auto part.'),
  partCategory: z.string().describe('The category of the auto part (e.g., brakes, filters, engine parts).'),
  manufacturer: z.string().describe('The manufacturer of the auto part.'),
  model: z.string().describe('The vehicle model the part is compatible with.'),
  year: z.string().describe('The year the vehicle model was manufactured.'),
  technicalSpecifications: z.string().describe('Technical specifications of the part, such as dimensions, material, etc.'),
  condition: z.string().describe('The condition of the part, e.g. new, used, refurbished.'),
});

export type GeneratePartDescriptionInput = z.infer<typeof GeneratePartDescriptionInputSchema>;

const GeneratePartDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and professional description of the auto part.'),
});

export type GeneratePartDescriptionOutput = z.infer<typeof GeneratePartDescriptionOutputSchema>;

export async function generatePartDescription(input: GeneratePartDescriptionInput): Promise<GeneratePartDescriptionOutput> {
  return generatePartDescriptionFlow(input);
}

const generatePartDescriptionPrompt = ai.definePrompt({
  name: 'generatePartDescriptionPrompt',
  input: {schema: GeneratePartDescriptionInputSchema},
  output: {schema: GeneratePartDescriptionOutputSchema},
  prompt: `You are an expert in creating detailed and professional descriptions for auto parts.

  Using the information provided below, generate a comprehensive description of the auto part that can be used in an online store or catalog.
  Include relevant details to help customers make informed purchase decisions.

  Part Name: {{partName}}
  Part Category: {{partCategory}}
  Manufacturer: {{manufacturer}}
  Model: {{model}}
  Year: {{year}}
  Technical Specifications: {{technicalSpecifications}}
  Condition: {{condition}}
  `,
});

const generatePartDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePartDescriptionFlow',
    inputSchema: GeneratePartDescriptionInputSchema,
    outputSchema: GeneratePartDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generatePartDescriptionPrompt(input);
    return output!;
  }
);
