import rss from '@astrojs/rss';
import { BLOG_SITE_URL, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getAuthorEntries, getBlogEntries } from '../lib/blog-content';
import { isPublicPost, normalizePosts, sortPostsByDate } from '../lib/posts';

export async function GET() {
	const [entries, authorEntries] = await Promise.all([getBlogEntries(), getAuthorEntries()]);
	const posts = sortPostsByDate(normalizePosts(entries, authorEntries)).filter(isPublicPost);

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
