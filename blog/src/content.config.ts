// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title:       z.string(),
    description: z.string(),
    // permite string ou Date, e coerção para Date
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Se você quiser usar o helper image() para imagens locais, use image().optional()
    // Caso use apenas string (URL ou caminho relativo), use z.string().optional()
    heroImage:   z.string().optional(),
    // outros campos que você tenha (tags, draft, etc)
  }),
});

export const collections = { blog };
