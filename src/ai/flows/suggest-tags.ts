'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for tasks using AI.
 *
 * - suggestTags - A function that suggests tags for a given task description.
 * - SuggestTagsInput - The input type for the suggestTags function, containing the task description.
 * - SuggestTagsOutput - The output type for the suggestTags function, containing an array of suggested tags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the task for which to suggest tags.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the task description.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `Suggest relevant tags for the following task description. Return a JSON array of strings.

Task Description: {{{description}}}`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
