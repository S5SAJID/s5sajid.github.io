import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { collections as existingCollections } from './content/config';

const legalPk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal-pk' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    version: z.string().min(1),
    status: z.enum(['example', 'active', 'archived']),
    updatedDate: z.string().date(),
    effectiveDate: z.string().date().optional(),
    draft: z.boolean().default(true),
    order: z.number().int().default(0),
  }).refine((document) => document.status !== 'active' || Boolean(document.effectiveDate), {
    message: 'Active documents require an effective date.',
    path: ['effectiveDate'],
  }),
});

export const collections = { ...existingCollections, legalPk };
