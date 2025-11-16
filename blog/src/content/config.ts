// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Coleção principal de posts do blog PAVIE | Advocacia
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Campos básicos OBRIGATÓRIOS
    title: z.string(),
    description: z.string(),

    // Mantemos o nome ORIGINAL do starter: "pubDate"
    // e usamos z.coerce.date() para aceitar strings tipo "Jul 08 2022"
    pubDate: z.coerce.date(),

    // Data de atualização (opcional)
    updatedDate: z.coerce.date().optional(),

    // heroImage como STRING (caminho para a imagem)
    // Ex.: '../../assets/blog-placeholder-3.jpg'
    heroImage: z.string().optional(),

    // --- Metadados editoriais PAVIE (todos OPCIONAIS) ---

    eixo: z
      .enum([
        'familia-patrimonio-seguro',
        'sucessoes-inventario',
        'divorcios-dissolucoes',
        'familia-binacional',
        'contratos-negocios',
        'trabalho-previdencia-saude-suplementar',
        'tributos-fazenda-publica',
        'imobiliario-regularizacao',
        'compliance-governanca',
      ])
      .optional(),

    persona: z.string().optional(),

    funil: z.enum(['TOFU', 'MOFU', 'BOFU']).optional(),

    layoutType: z
      .enum([
        'guia-estruturado',
        'analise-de-caso',
        'checklist-pratico',
        'faq',
        'opiniao-curta',
      ])
      .optional(),

    destaqueHome: z.boolean().default(false),

    responsavelEditorial: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
