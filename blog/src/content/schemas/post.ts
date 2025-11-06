import { z } from 'zod';

export const postSchema = z.object({
  title: z.string(),
  description: z.string().max(155),
  pubDate: z.string(), // ISO date
  author: z.string().default('PAVIE | Advocacia'),
  type: z.enum(['autoridade','guia','jurisprudencia','noticia','opiniao']).default('autoridade'),
  tags: z.array(z.string()).default(['SucessÃµes & InventÃ¡rio']),
  cover: z.object({
    src: z.string(),
    alt: z.string()
  }),
  canonical: z.string().url().optional(),
  noindex: z.boolean().optional()
});
