import { getCollection } from 'astro:content';
export async function GET() {
  const posts = (await getCollection('blog')).filter(p => !p.data.draft).map(p => ({
    url: `/blog/${p.slug}/`,
    title: p.data.title,
    summary: p.data.description || "",
    tags: p.data.tags || [],
    categorias: p.data.categorias || [],
    date: p.data.date
  }));
  return new Response(JSON.stringify(posts), { headers: { "Content-Type": "application/json" } });
}
