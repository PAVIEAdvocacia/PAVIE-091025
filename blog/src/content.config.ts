// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Carrega todos os arquivos Markdown (.md ou .mdx) da pasta src/content/blog/
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),

  // Define o esquema de validação do frontmatter (metadados) usando Zod
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    // Converte automaticamente strings para Date
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Caso queira usar helper image() para imagens locais, troque por: image().optional()
    heroImage:   z.string().optional(),
  }),
});

export const collections = {
  blog
};
