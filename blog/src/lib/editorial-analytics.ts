import type { BlogPost } from './posts';
import type { CanonicalAreaDirectoryItem } from './canonical-directory';

export const EDITORIAL_ANALYTICS_EVENTS = {
	B1_CATEGORY_CLICK: 'editorial_b1_category_click',
	B1_ARTICLE_CLICK: 'editorial_b1_article_click',
	B2_S2_CLICK: 'editorial_b2_s2_click',
	B3_S2_FINAL_CTA_CLICK: 'editorial_b3_s2_final_cta_click',
	B3_RELATED_READ_CLICK: 'editorial_b3_related_read_click',
	B4_SITE_CLICK: 'editorial_b4_site_click',
	S2_BLOG_BRIDGE_CLICK: 'editorial_s2_blog_bridge_click',
	S2_SITE_CONTACT_CLICK: 'editorial_s2_site_contact_click',
} as const;

export type EditorialAnalyticsEventName =
	(typeof EDITORIAL_ANALYTICS_EVENTS)[keyof typeof EDITORIAL_ANALYTICS_EVENTS];

export type EditorialSurface = 'B1' | 'B2' | 'B3' | 'B4' | 'S2' | 'SITE';

export type EditorialLinkType =
	| 'article-link'
	| 'category-link'
	| 'area-bridge'
	| 'final-cta'
	| 'related-read'
	| 'site-link'
	| 'site-contact'
	| 'blog-bridge';

export interface EditorialAnalyticsContext {
	eventName: EditorialAnalyticsEventName;
	surfaceOrigin: EditorialSurface;
	surfaceTarget: EditorialSurface;
	linkType: EditorialLinkType;
	categoryCode?: string;
	categorySlug?: string;
	articleSlug?: string;
	areaSlug?: string;
	authorSlug?: string;
}

export type EditorialAnalyticsAttributes = Record<string, string>;

function slugFromHref(href?: string): string | undefined {
	if (!href) return undefined;
	const path = href
		.replace(/^https?:\/\/[^/]+/i, '')
		.split(/[?#]/)[0]
		.replace(/^\/+|\/+$/g, '');
	const parts = path.split('/').filter(Boolean);
	return parts.at(-1);
}

function assignIfDefined(
	attrs: EditorialAnalyticsAttributes,
	key: string,
	value: string | undefined,
) {
	if (value) {
		attrs[key] = value;
	}
}

export function editorialAnalyticsAttributes(
	context: EditorialAnalyticsContext,
): EditorialAnalyticsAttributes {
	const attrs: EditorialAnalyticsAttributes = {
		'data-analytics-event': context.eventName,
		'data-analytics-surface-origin': context.surfaceOrigin,
		'data-analytics-surface-target': context.surfaceTarget,
		'data-analytics-link-type': context.linkType,
	};

	assignIfDefined(attrs, 'data-analytics-category-code', context.categoryCode);
	assignIfDefined(attrs, 'data-analytics-category-slug', context.categorySlug);
	assignIfDefined(attrs, 'data-analytics-article-slug', context.articleSlug);
	assignIfDefined(attrs, 'data-analytics-area-slug', context.areaSlug);
	assignIfDefined(attrs, 'data-analytics-author-slug', context.authorSlug);

	return attrs;
}

export function postAnalyticsContext(post: BlogPost): Omit<
	EditorialAnalyticsContext,
	'eventName' | 'surfaceOrigin' | 'surfaceTarget' | 'linkType'
> {
	return {
		categoryCode: post.categoryCode,
		categorySlug: post.categorySlug,
		articleSlug: post.slug,
		areaSlug: slugFromHref(post.areaUrl),
		authorSlug: post.authorSlug,
	};
}

export function categoryAnalyticsContext(category: CanonicalAreaDirectoryItem): Omit<
	EditorialAnalyticsContext,
	'eventName' | 'surfaceOrigin' | 'surfaceTarget' | 'linkType'
> {
	return {
		categoryCode: category.code,
		categorySlug: category.slug,
		areaSlug: slugFromHref(category.href),
	};
}
