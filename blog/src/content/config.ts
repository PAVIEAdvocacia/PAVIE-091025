// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Coleção principal de posts do blog PAVIE | Advocacia
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Campos básicos do template oficial
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),

    // --- Metadados editoriais Redator PAVIE ---

    // Eixo/área de prática – opcional, mas recomendado
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

    // Persona-alvo (livre, para você nomear: “Sofia – inventário binacional”, etc.)
    persona: z.string().optional(),

    // Estágio de funil (útil para futuro controle de pauta)
    funil: z
      .enum(['TOFU', 'MOFU', 'BOFU'])
      .optional(),

    // Tipo de layout lógico do texto
    layoutType: z
      .enum([
        'guia-estruturado',      // “guia passo a passo”
        'analise-de-caso',      // estudo de caso / narrativa
        'checklist-pratico',    // lista de verificação
        'faq',                  // perguntas e respostas
        'opiniao-curta',        // comentário breve/nota
      ])
      .default('guia-estruturado'),

    // Se o artigo deve ganhar destaque em grids, carrosséis etc.
    destaqueHome: z.boolean().default(false),

    // Campo “interno” de controle (quem revisou / assinou)
    responsavelEditorial: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
