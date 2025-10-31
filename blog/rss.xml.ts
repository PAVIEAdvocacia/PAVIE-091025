// src/pages/blog/rss.xml.ts — Feed RSS do Blog PAVIE
// Caminho final publicado: https://pavieadvocacia.com.br/blog/rss.xml
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  // posts precisam ter: title, date (Date), description no frontmatter
  return rss({
    title: 'PAVIE | Blog',
    description: 'Conteúdo jurídico com base legal e leitura agradável.',
    site: context.site ?? 'https://pavieadvocacia.com.br',
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((p) => ({
        title: p.data.title,
        pubDate: p.data.date,
        description: p.data.description,
        link: `/blog/${p.slug}/`,
      })),
    stylesheet: false,
  });
}
