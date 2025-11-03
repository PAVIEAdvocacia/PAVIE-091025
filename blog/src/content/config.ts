import { defineCollection, z } from "astro:content";

const dateCoerce = z.preprocess((v) => (typeof v === "string" || v instanceof Date) ? new Date(v as any) : v, z.date());

const base = {
  type: z.enum(["autoridade","guia","jurisprudencia","noticia","opiniao"]),
  title: z.string(),
  description: z.string().optional(),
  // aceita date ou pubDate
  pubDate: dateCoerce.optional(),
  date: dateCoerce.optional(),
  updated: dateCoerce.optional(),
  author: z.string().default("Fabio Mathias Pavie"),
  tags: z.array(z.string()).default([]),
  // aceita heroImage ou featuredImage
  heroImage: z.string().optional(),
  featuredImage: z.string().optional(),
  lang: z.enum(["pt-BR","pt","en","de"]).default("pt-BR"),
  service_cluster: z.enum(["sucessoes","familia","contratos","imobiliario","consumidor","internacional","previdenciario","tributario","compliance"]).optional(),
  jurisdiction: z.enum(["BR","EU","DE","PT"]).default("BR"),
  toc: z.boolean().default(true),
  cta: z.object({ label: z.string(), url: z.string() }).optional(),
  seo: z.object({ schema_type: z.enum(["Article","BlogPosting","NewsArticle","HowTo"]).default("Article") }).optional(),
  // campos específicos de alguns tipos
  case_refs: z.array(z.string()).optional(),
  source_url: z.string().optional(),
};

export const collections = {
  posts: defineCollection({ type: "content", schema: z.object(base) }),
};
