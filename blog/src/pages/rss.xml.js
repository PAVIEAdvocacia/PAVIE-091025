import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { isPublicPost, normalizePost, sortPostsByDate } from '../lib/posts';

export async function GET(context) {
	const entries = await getCollection('blog');
	const posts = sortPostsByDate(entries.map((entry) => normalizePost(entry))).filter(isPublicPost);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.publishedAt ?? new Date(),
			link: post.url,
		})),
	});
}
