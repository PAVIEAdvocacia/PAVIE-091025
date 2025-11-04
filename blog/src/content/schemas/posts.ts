import { z, defineCollection } from 'astro:content';

export const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(8),
    description: z.string().max(155),
    pubDate: z.coerce.date(),
    author: z.string().default('PAVIE | Advocacia'),
    type: z.enum(['autoridade','guia','jurisprudencia','noticia','opiniao']),
    tags: z.array(z.string()).nonempty(),
    cover: z.object({ src: z.string(), alt: z.string().min(10) }),
    canonical: z.string().url().optional(),
    noindex: z.boolean().optional().default(false)
  })
});
