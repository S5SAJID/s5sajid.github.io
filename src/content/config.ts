import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(), 
    category: z.string(),
    date: z.string(),
    lastModified: z.string().optional().default(() => new Date().toISOString()),
    readTime: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional().default(''),
  }),
});

export const collections = {
  'blog': blogCollection,
};
