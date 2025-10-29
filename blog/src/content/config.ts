import { defineCollection, z } from 'astro:content';
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    categorias: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    author: z.string().default('PAVIE'),
    draft: z.boolean().default(false)
  })
});
export const collections = { blog };
