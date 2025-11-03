import { defineCollection, z } from "astro:content";

const postSchema = z.object({
  type: z.enum(["autoridade","guia","jurisprudencia","caso","faq"]),
  title: z.string(),
  description: z.string().max(320),
  author: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  lang: z.enum(["pt-BR","en","de"]).default("pt-BR"),
  service_cluster: z.enum(["familia","sucessoes","contratos","consumidor","compliance","tributario"]).optional(),
  jurisdiction: z.enum(["BR","EU","DE","PT"]).default("BR"),
  toc: z.boolean().default(true),
  cta: z.object({ label: z.string(), url: z.string() }).optional()
});

const posts = defineCollection({
  type: "content",
  schema: postSchema
});

export const collections = { posts };
