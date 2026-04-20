// @ts-check

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const site =
	process.env.PUBLIC_BLOG_SITE_URL?.replace(/\/+$/, '') ||
	process.env.PUBLIC_SITE_ORIGIN?.replace(/\/+$/, '') ||
	'https://blog.pavieadvocacia.com.br';
const sitemapExcludedPaths = ['/blog/sobre/'];

/**
 * @param {string} page
 */
function shouldIncludeInSitemap(page) {
	const pathname = new URL(page).pathname;
	const matchesExcludedPath = sitemapExcludedPaths.some(
		(path) => pathname === path || pathname === path.replace(/\/$/, ''),
	);
	if (matchesExcludedPath) {
		return false;
	}
	return true;
}

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		mdx(),
		sitemap({
			filter: shouldIncludeInSitemap,
		}),
	],
});
