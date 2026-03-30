// @ts-check

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

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
	site: 'https://blog.pavieadvocacia.com.br',
	integrations: [
		mdx(),
		sitemap({
			filter: shouldIncludeInSitemap,
		}),
	],
});
