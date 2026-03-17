// @ts-check

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const sitemapExcludedPrefixes = ['/blog/areas/', '/blog/temas/'];
const sitemapExcludedPaths = [
	'/blog/sobre/',
	'/blog/divorcio-em-2025-cartorio-filhos-menores-protecao-patrimonial/',
	'/blog/negativa-de-cobertura-do-plano-de-saude-o-que-guardar/',
];

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
	const matchesExcludedPrefix = sitemapExcludedPrefixes.some(
		(prefix) =>
			pathname.startsWith(prefix) ||
			pathname === prefix.replace(/\/$/, '') ||
			page.includes(prefix),
	);
	return !matchesExcludedPrefix;
}

// https://astro.build/config
export default defineConfig({
	site: 'https://pavieadvocacia.com.br',
	integrations: [
		mdx(),
		sitemap({
			filter: shouldIncludeInSitemap,
		}),
	],
});
