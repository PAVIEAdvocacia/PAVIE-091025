import rss from '@astrojs/rss';
import { BLOG_SITE_URL, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getBlogEntries } from '../lib/blog-content';
import { isPublicPost, normalizePost, sortPostsByDate } from '../lib/posts';

export async function GET(context) {
	const entries = await getBlogEntries();
	const posts = sortPostsByDate(entries.map((entry) => normalizePost(entry))).filter(isPublicPost);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: BLOG_SITE_URL,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.publishedAt ?? new Date(),
			link: post.url,
		})),
	});
}
