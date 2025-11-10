// src/content/schemas/post.ts
import { z, defineCollection } from "astro:content";

export const postSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  pubDate: z.coerce.date(),                // aceita string ISO
  updatedAt: z.coerce.date().optional(),
  author: z.string().default("PAVIE | Advocacia"),
  type: z.enum(["autoridade","guia","jurisprudencia","noticia","opiniao"]),

  // Personas (correção e padronização)
  persona_publico: z.enum(["pf","pj","colega"]),          // pessoa física, pessoa jurídica, colega/operador
  persona_estagio: z.enum(["tofu","mofu","bofu"]).default("tofu"),

  tags: z.array(z.string()).default([]),
  cover: z.object({ src: z.string(), alt: z.string().min(3) }).optional(),

  // Blocos opcionais
  intro: z.object({
    scqa: z.object({
      situacao: z.string().optional(),
      complicacao: z.string().optional(),
      pergunta: z.string().optional(),
      resposta: z.string().optional(),
    }).optional()
  }).optional(),

  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),

  referencias: z.object({
    normas: z.array(z.string()).default([]),        // ex.: CF/88 art. X; CC art. 1.XXX; CPC art. XXX
    precedentes: z.array(z.string()).default([]),   // ex.: STJ, REsp 1.XXX/XX, Rel. Min. Andrighi, j. 00/00/0000
  }).default({ normas: [], precedentes: [] }),

  draft: z.boolean().default(false),
});

export const postsCollection = defineCollection({
  type: "content",
  schema: postSchema,
});
