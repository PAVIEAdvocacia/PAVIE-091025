import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'PAVIE | Blog',
    description: 'Conteúdo jurídico com base legal e leitura agradável.',
    site: context.site,
    items: posts.sort((a,b)=> b.data.date.valueOf() - a.data.date.valueOf()).map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `/blog/${p.slug}/`
    })),
    stylesheet: false
  });
}
