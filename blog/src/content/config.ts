import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog };
