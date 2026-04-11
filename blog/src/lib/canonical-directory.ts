import type { CollectionEntry } from 'astro:content';
import type { BlogPost } from './posts';
import { canonicalAreaHref, canonicalCategoryHref } from './canonical-content';

export type AreaEntry = CollectionEntry<'areas'>;
export type AuthorEntry = CollectionEntry<'authors'>;

export interface CanonicalAreaDirectoryItem {
	entry: AreaEntry;
	code: string;
	slug: string;
	title: string;
	canonicalTitle: string;
	displayTitle: string;
	shortDescription: string;
	headline: string;
	description: string;
	href: string;
	categoryHref: string;
	postCount: number;
	posts: BlogPost[];
	featuredPost?: BlogPost;
	latestPosts: BlogPost[];
}

export function sortAreaEntries(entries: AreaEntry[]): AreaEntry[] {
	return [...entries].sort((a, b) => {
		const orderDiff = (a.data.order ?? 999) - (b.data.order ?? 999);
		if (orderDiff !== 0) return orderDiff;
		return a.data.title.localeCompare(b.data.title, 'pt-BR');
	});
}

export function buildCanonicalAreaDirectory(
	areas: AreaEntry[],
	posts: BlogPost[],
): CanonicalAreaDirectoryItem[] {
	const safePosts = Array.isArray(posts) ? posts : [];
	return sortAreaEntries(areas)
		.filter((entry) => entry.data.isActive !== false)
		.map((entry) => {
			const areaPosts = safePosts.filter((post) => post.categoryCode === entry.data.categoryCode);
			return {
				entry,
				code: entry.data.categoryCode,
				slug: entry.data.slug,
				title: entry.data.title,
				canonicalTitle: entry.data.canonicalTitle ?? entry.data.title,
				displayTitle: entry.data.displayTitle ?? entry.data.title,
				shortDescription: entry.data.shortDescription,
				headline: entry.data.headline,
				description: entry.data.description,
				href: canonicalAreaHref(entry.data.slug),
				categoryHref: canonicalCategoryHref(entry.data.categoryCode),
				postCount: areaPosts.length,
				posts: areaPosts,
				featuredPost: areaPosts[0],
				latestPosts: areaPosts.slice(0, 3),
			};
		});
}

export function getCanonicalAreaDirectoryItem(
	areas: AreaEntry[],
	posts: BlogPost[],
	slug: string,
): CanonicalAreaDirectoryItem | undefined {
	return buildCanonicalAreaDirectory(areas, posts).find((item) => item.slug === slug);
}

export function getAreaEntryByCategoryCode(
	areas: AreaEntry[],
	categoryCode?: string,
): AreaEntry | undefined {
	if (!categoryCode) return undefined;
	return areas.find((entry) => entry.data.categoryCode === categoryCode);
}

export function getAuthorEntryBySlug(
	authors: AuthorEntry[],
	slug: string,
): AuthorEntry | undefined {
	return authors.find((entry) => entry.data.slug === slug);
}
