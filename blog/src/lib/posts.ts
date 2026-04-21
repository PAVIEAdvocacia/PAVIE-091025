import type { CollectionEntry } from 'astro:content';
import { BLOG_SITE_URL, DEFAULT_AUTHOR_NAME, DEFAULT_AUTHOR_ROLE } from '../consts';
import {
	canonicalAreaHref,
	canonicalAuthorHref,
	canonicalCategoryHref,
	getAuthorDefinitionById,
	getCanonicalCategoryDefinition,
	hasApprovedCanonicalCorrespondenceForLegacyArea,
	resolveApprovedCategoryCodeFromLegacyArea,
	resolveLegacyFunnelStage,
} from './canonical-content';
import { normalizeCmsImagePath } from './content-media';
import { PRIMARY_CTA_OPTIONS } from './editorial-taxonomy';
import { areaLabel, normalizeAreaKey, normalizeTemaKey } from './taxonomy';

export type RawPostEntry = CollectionEntry<'posts'>;
export type AuthorEntry = CollectionEntry<'authors'>;

export interface CtaConfig {
	label: string;
	href: string;
	description: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface BlogPost {
	entry: RawPostEntry;
	id: string;
	slug: string;
	slugKey: string;
	url: string;
	title: string;
	seoTitle?: string;
	description: string;
	excerpt: string;
	area: string;
	areaKey: string;
	categoryCode?: string;
	canonicalCategory?: string;
	categorySlug?: string;
	categoryUrl?: string;
	areaUrl?: string;
	subarea?: string;
	temas: string[];
	temaKeys: string[];
	painPoints: string[];
	tags: string[];
	funnelStage: string;
	authorId?: string;
	authorName: string;
	authorRole: string;
	authorSlug?: string;
	authorUrl?: string;
	authorImage?: string;
	authorImageAlt?: string;
	publishedAt?: Date;
	updatedAt?: Date;
	image?: string;
	imageAlt: string;
	readingTime: number;
	contentType?: string;
	readerStage?: string;
	ctaType?: string;
	ctaTarget?: string;
	ctaKey: string;
	cta: CtaConfig;
	relatedArticles: string[];
	faqItems: FaqItem[];
	status: string;
	featured: boolean;
	noindex: boolean;
	canonicalUrl?: string;
	contentModel: 'legacy' | 'canonical';
	publicSurfaceStatus: 'allowed' | 'blocked_unresolved_taxonomy';
	legacyAreaHasApprovedCanonicalCorrespondence: boolean;
}

const WORDS_PER_MINUTE = 220;
const PRIMARY_CTA_BY_KEY = Object.fromEntries(
	PRIMARY_CTA_OPTIONS.map((option) => [option.key, option]),
) as Record<string, CtaConfig & { key?: string }>;

function cleanString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function cleanList(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map((item) => cleanString(item))
			.filter(Boolean);
	}
	if (typeof value === 'string') {
		return value
			.split(/[,;|]/)
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
}

function uniqueList(values: string[]): string[] {
	return Array.from(
		new Map(values.filter(Boolean).map((value) => [value.toLowerCase(), value])).values(),
	);
}

function parseDate(value: unknown): Date | undefined {
	if (value instanceof Date && !Number.isNaN(value.valueOf())) {
		return value;
	}
	if (typeof value === 'string' || typeof value === 'number') {
		const date = new Date(value);
		if (!Number.isNaN(date.valueOf())) {
			return date;
		}
	}
	return undefined;
}

function buildReadingTime(rawBody: string, explicitReadingTime?: number): number {
	if (typeof explicitReadingTime === 'number' && explicitReadingTime > 0) {
		return Math.round(explicitReadingTime);
	}
	const wordCount = rawBody
		.replace(/[#*_`>\-\[\]\(\)!]/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function normalizeSlug(value: string): string {
	const raw = value
		.trim()
		.replace(/^\/+|\/+$/g, '')
		.replace(/\\/g, '/')
		.split('/')
		.filter(Boolean)
		.join('/');
	if (!raw) return '';
	return raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function inferThemes(title: string, description: string): string[] {
	const source = `${title} ${description}`.toLowerCase();
	const themes: string[] = [];
	if (source.includes('divorcio')) themes.push('Divorcio');
	if (source.includes('guarda')) themes.push('Guarda');
	if (source.includes('inventario')) themes.push('Inventario');
	if (source.includes('partilha')) themes.push('Partilha');
	if (source.includes('contrato')) themes.push('Contratos');
	if (source.includes('imovel')) themes.push('Imovel');
	return themes;
}

function ensureDescription(title: string, description: string): string {
	if (description) return description;
	return `Analise juridica da PAVIE sobre ${title.toLowerCase()}.`;
}

function resolveLegacyStatus(rawValue: string): string {
	const value = rawValue.toLowerCase();
	if (['draft', 'published', 'archived'].includes(value)) return value;
	if (['publicado', 'active'].includes(value)) return 'published';
	if (['rascunho'].includes(value)) return 'draft';
	if (['arquivado'].includes(value)) return 'archived';
	return 'draft';
}

function defaultPrimaryCtaKey(funnelStage: string): string {
	if (funnelStage === 'orientacao' || funnelStage === 'contato') {
		return 'diagnostico_juridico';
	}
	if (funnelStage === 'consideracao') {
		return 'diagnostico_juridico';
	}
	return 'areas_editoriais';
}

function resolveLegacyPrimaryCtaKey(rawValue: string, funnelStage: string): string {
	const key = rawValue.toLowerCase();
	if (PRIMARY_CTA_BY_KEY[key]) {
		return key;
	}
	return defaultPrimaryCtaKey(funnelStage);
}

function resolveLegacyPrimaryCta(key: string): CtaConfig {
	return PRIMARY_CTA_BY_KEY[key] ?? PRIMARY_CTA_BY_KEY.areas_editoriais;
}

function resolveCanonicalCta(
	ctaType: string,
	ctaTarget: string,
	areaUrl: string,
	categoryUrl: string,
): { ctaKey: string; cta: CtaConfig } {
	const safeCategoryHref = categoryUrl || '/blog/';
	const safeAreaHref = areaUrl || '/#areas';

	switch (ctaType) {
		case 'contact':
			return {
				ctaKey: 'diagnostico_juridico',
				cta: {
					label: 'Solicitar orientacao inicial',
					href: ctaTarget || '/contato/',
					description:
						'Entenda quando faz sentido avancar para a orientacao inicial e quais informacoes ajudam no primeiro contato.',
				},
			};
		case 'area': {
			const href = ctaTarget || safeAreaHref;
			const institutional = href.startsWith('/areas/') || href === '/#areas';
			return {
				ctaKey: institutional ? 'areas_de_atuacao' : 'areas_editoriais',
				cta: {
					label: institutional ? 'Conheça a área correspondente' : 'Explorar temas',
					href,
					description: institutional
						? 'Veja como a PAVIE apresenta esta area de atuacao na camada institucional do site.'
						: 'Continue a leitura por assunto e encontre novos caminhos para aprofundar a situacao.',
				},
			};
		}
		case 'article-series':
			return {
				ctaKey: 'areas_editoriais',
				cta: {
					label: 'Explorar temas',
					href: ctaTarget || safeCategoryHref,
					description:
						'Continue a leitura por assunto e encontre novos caminhos para aprofundar a situacao.',
				},
			};
		case 'document-review':
			return {
				ctaKey: 'diagnostico_juridico',
				cta: {
					label: 'Solicitar análise inicial',
					href: ctaTarget || '/contato/',
					description:
						'Comece reunindo os documentos principais para avaliar a via mais adequada para a situacao.',
				},
			};
		default:
			return {
				ctaKey: 'areas_editoriais',
				cta: resolveLegacyPrimaryCta('areas_editoriais'),
			};
	}
}

function resolvePostStatus(data: RawPostEntry['data']): string {
	if (typeof data.draft === 'boolean') {
		if (data.draft) return 'draft';
		if (cleanString(data.migrationStatus).toLowerCase() === 'archived') return 'archived';
		return 'published';
	}
	return resolveLegacyStatus(cleanString(data.status));
}

function resolveContentModel(data: RawPostEntry['data']): 'legacy' | 'canonical' {
	const hasCanonicalSignals =
		Boolean(cleanString(data.categoryCode)) ||
		Boolean(cleanString(data.authorId)) ||
		Boolean(data.publishDate) ||
		Boolean(cleanString(data.contentType)) ||
		Boolean(cleanString(data.readerStage)) ||
		Boolean(cleanString(data.ctaType)) ||
		Boolean(cleanString(data.ctaTarget)) ||
		Boolean(cleanString(data.legalReview)) ||
		Boolean(cleanString(data.editorialReview)) ||
		Boolean(cleanString(data.migrationStatus));

	return hasCanonicalSignals ? 'canonical' : 'legacy';
}

function resolveAreaContext(data: RawPostEntry['data']): {
	legacyAreaValue: string;
	areaKey: string;
	area: string;
	categoryCode?: string;
	categorySlug?: string;
	categoryUrl?: string;
	areaUrl?: string;
} {
	const explicitCategoryCode =
		cleanString(data.canonicalCategory) || cleanString(data.categoryCode) || undefined;
	const legacyAreaValue = cleanString(data.area) || cleanString(data.legacyAreaKey) || '';
	const mappedCategoryCode = legacyAreaValue
		? resolveApprovedCategoryCodeFromLegacyArea(normalizeAreaKey(legacyAreaValue))
		: undefined;
	const categoryCode = explicitCategoryCode || mappedCategoryCode;
	const categoryDefinition = categoryCode
		? getCanonicalCategoryDefinition(categoryCode)
		: undefined;
	const fallbackAreaValue = legacyAreaValue || categoryDefinition?.slug || '';
	const areaKey = normalizeAreaKey(fallbackAreaValue);

	return {
		legacyAreaValue,
		areaKey,
		area: categoryDefinition?.label ?? areaLabel(fallbackAreaValue),
		categoryCode,
		categorySlug: categoryDefinition?.slug,
		categoryUrl: categoryCode ? canonicalCategoryHref(categoryCode) : undefined,
		areaUrl: categoryDefinition ? canonicalAreaHref(categoryDefinition.code) : undefined,
	};
}

function normalizeAuthorLookup(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

function findAuthorEntry(
	authorEntries: AuthorEntry[],
	data: RawPostEntry['data'],
): AuthorEntry | undefined {
	if (!authorEntries.length) return undefined;

	const authorId = cleanString(data.authorId);
	if (authorId) {
		const byId = authorEntries.find((entry) => entry.data.id === authorId);
		if (byId) return byId;
	}

	const legacyAuthor = cleanString(data.author);
	if (!legacyAuthor) return undefined;

	const normalizedLegacyAuthor = normalizeAuthorLookup(legacyAuthor);
	return authorEntries.find((entry) => {
		return (
			normalizeAuthorLookup(entry.data.name) === normalizedLegacyAuthor ||
			normalizeAuthorLookup(entry.data.slug) === normalizedLegacyAuthor ||
			normalizeAuthorLookup(entry.data.id) === normalizedLegacyAuthor
		);
	});
}

function resolveAuthorContext(
	data: RawPostEntry['data'],
	authorEntries: AuthorEntry[] = [],
): {
	authorId?: string;
	authorName: string;
	authorRole: string;
	authorSlug?: string;
	authorUrl?: string;
	authorImage?: string;
	authorImageAlt?: string;
} {
	const matchedAuthorEntry = findAuthorEntry(authorEntries, data);
	if (matchedAuthorEntry) {
		const definition = getAuthorDefinitionById(matchedAuthorEntry.data.id);
		return {
			authorId: matchedAuthorEntry.data.id,
			authorName: matchedAuthorEntry.data.name,
			authorRole: definition?.role ?? DEFAULT_AUTHOR_ROLE,
			authorSlug: matchedAuthorEntry.data.slug,
			authorUrl: canonicalAuthorHref(matchedAuthorEntry.data.slug),
			authorImage:
				normalizeCmsImagePath(matchedAuthorEntry.data.image) ?? matchedAuthorEntry.data.image,
			authorImageAlt: matchedAuthorEntry.data.imageAlt,
		};
	}

	const authorId = cleanString(data.authorId) || undefined;
	if (authorId) {
		const definition = getAuthorDefinitionById(authorId);
		if (definition) {
			return {
				authorId,
				authorName: definition.name,
				authorRole: definition.role,
				authorSlug: definition.slug,
				authorUrl: canonicalAuthorHref(definition.slug),
				authorImage: definition.image,
				authorImageAlt: definition.imageAlt,
			};
		}
	}

	const legacyAuthorName = cleanString(data.author);
	const matchedAuthor = legacyAuthorName
		? getAuthorDefinitionById(
				legacyAuthorName.toLowerCase() === 'fabio mathias pavie' ? 'fabio-pavie' : '',
			)
		: undefined;
	if (matchedAuthor) {
		return {
			authorId: matchedAuthor.id,
			authorName: matchedAuthor.name,
			authorRole: matchedAuthor.role,
			authorSlug: matchedAuthor.slug,
			authorUrl: canonicalAuthorHref(matchedAuthor.slug),
			authorImage: matchedAuthor.image,
			authorImageAlt: matchedAuthor.imageAlt,
		};
	}

	return {
		authorId,
		authorName: legacyAuthorName || DEFAULT_AUTHOR_NAME,
		authorRole: DEFAULT_AUTHOR_ROLE,
		authorSlug: undefined,
		authorUrl: undefined,
		authorImage: undefined,
		authorImageAlt: undefined,
	};
}

function resolveFunnelStage(data: RawPostEntry['data']): string {
	const readerStage = cleanString(data.readerStage);
	if (readerStage) {
		return resolveLegacyFunnelStage(readerStage);
	}
	return cleanString(data.funnel_stage) || 'consideracao';
}

function resolveThemesAndTags(data: RawPostEntry['data'], title: string, description: string) {
	const themes = cleanList(data.themes);
	const tags = cleanList(data.tags);
	const keywords = cleanList(data.keywords);
	const painPoints = cleanList(data.pain_points);
	const derivedThemes =
		themes.length > 0 ? themes : tags.length > 0 ? tags : inferThemes(title, description);
	const temaKeys = derivedThemes.map((item) => normalizeTemaKey(item));
	const normalizedTags = uniqueList([
		...tags,
		...keywords,
		...derivedThemes,
		...painPoints,
		...(cleanString(data.subarea) ? [cleanString(data.subarea)] : []),
	]);

	return {
		derivedThemes,
		temaKeys,
		painPoints,
		normalizedTags,
	};
}

export function postRoute(slug: string): string {
	return `/blog/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function isPublicPost(post: BlogPost): boolean {
	return (
		post.status === 'published' &&
		!post.noindex &&
		post.publicSurfaceStatus === 'allowed' &&
		Boolean(post.slug) &&
		Boolean(post.publishedAt)
	);
}

export function isPublishedPost(post: BlogPost): boolean {
	return post.status === 'published' && Boolean(post.slug) && Boolean(post.publishedAt);
}

export function normalizePost(entry: RawPostEntry, authorEntries: AuthorEntry[] = []): BlogPost {
	const data = entry.data;
	const title = cleanString(data.title) || 'Publicacao sem titulo';
	const description = ensureDescription(title, cleanString(data.description));
	const excerpt = cleanString(data.excerpt) || description;
	const routeSlug = cleanString(data.slug) || cleanString(data.legacySlug) || entry.id;
	const slug = routeSlug.replace(/^\/+|\/+$/g, '');
	const slugKey = normalizeSlug(slug || entry.id);
	const { areaKey, area, categoryCode, categorySlug, categoryUrl, areaUrl, legacyAreaValue } =
		resolveAreaContext(data);
	const subarea = cleanString(data.subarea) || undefined;
	const { derivedThemes, temaKeys, painPoints, normalizedTags } = resolveThemesAndTags(
		data,
		title,
		description,
	);
	const {
		authorId,
		authorName,
		authorRole,
		authorSlug,
		authorUrl,
		authorImage,
		authorImageAlt,
	} = resolveAuthorContext(data, authorEntries);
	const publishedAt = parseDate(data.publishDate ?? data.publish_date);
	const updatedAt = parseDate(data.updatedAt ?? data.updatedDate);
	const explicitReadingTime =
		typeof data.readingTime === 'number' ? data.readingTime : data.reading_time;
	const readingTime = buildReadingTime(entry.body ?? '', explicitReadingTime);
	const image = normalizeCmsImagePath(cleanString(data.coverImage) || cleanString(data.og_image));
	const imageAlt =
		cleanString(data.coverImageAlt) ||
		cleanString(data.coverAlt) ||
		`Imagem de capa do artigo ${title}`;
	const funnelStage = resolveFunnelStage(data);
	const contentType = cleanString(data.contentType) || undefined;
	const readerStage = cleanString(data.readerStage) || undefined;
	const canonicalCtaType = cleanString(data.ctaType);
	const canonicalCtaTarget = cleanString(data.ctaTarget);
	const { ctaKey, cta } = canonicalCtaType
		? resolveCanonicalCta(
				canonicalCtaType,
				canonicalCtaTarget,
				areaUrl || '/#areas',
				categoryUrl || '/blog/',
			)
		: (() => {
				const legacyKey = resolveLegacyPrimaryCtaKey(cleanString(data.primary_cta), funnelStage);
				const legacyCta = resolveLegacyPrimaryCta(legacyKey);
				const normalizedLegacyCta =
					legacyKey === 'areas_editoriais'
						? { ...legacyCta, href: categoryUrl || '/blog/' }
						: legacyKey === 'areas_de_atuacao'
							? { ...legacyCta, href: areaUrl || '/#areas' }
							: legacyCta;
				return {
					ctaKey: legacyKey,
					cta: normalizedLegacyCta,
				};
			})();
	const relatedArticles = uniqueList([
		...cleanList(data.relatedPosts),
		...cleanList(data.related_articles),
	]).map((item) => normalizeSlug(item));
	const status = resolvePostStatus(data);
	const contentModel = resolveContentModel(data);
	const legacyAreaHasApprovedCanonicalCorrespondence =
		Boolean(legacyAreaValue) &&
		hasApprovedCanonicalCorrespondenceForLegacyArea(normalizeAreaKey(legacyAreaValue));
	const publicSurfaceStatus = categoryCode ? 'allowed' : 'blocked_unresolved_taxonomy';
	const featured = Boolean(data.featured);
	const noindex = Boolean(data.noindex);
	const seoTitle = cleanString(data.seoTitle) || cleanString(data.seo_title) || undefined;
	const canonicalUrlValue =
		cleanString(data.canonicalUrl) ||
		cleanString(data.canonicalURL) ||
		`${BLOG_SITE_URL}${postRoute(slug)}`;

	return {
		entry,
		id: entry.id,
		slug,
		slugKey,
		url: postRoute(slug),
		title,
		seoTitle,
		description,
		excerpt,
		area,
		areaKey,
		categoryCode,
		canonicalCategory: categoryCode,
		categorySlug,
		categoryUrl,
		areaUrl,
		subarea,
		temas: derivedThemes,
		temaKeys,
		painPoints,
		tags: normalizedTags,
		funnelStage,
		authorId,
		authorName,
		authorRole,
		authorSlug,
		authorUrl,
		authorImage,
		authorImageAlt,
		publishedAt,
		updatedAt,
		image,
		imageAlt,
		readingTime,
		contentType,
		readerStage,
		ctaType: canonicalCtaType || undefined,
		ctaTarget: canonicalCtaTarget || undefined,
		ctaKey,
		cta,
		relatedArticles,
		faqItems: [],
		status,
		featured,
		noindex,
		canonicalUrl: canonicalUrlValue,
		contentModel,
		publicSurfaceStatus,
		legacyAreaHasApprovedCanonicalCorrespondence,
	};
}

export function normalizePosts(
	entries: RawPostEntry[],
	authorEntries: AuthorEntry[] = [],
): BlogPost[] {
	return entries.map((entry) => normalizePost(entry, authorEntries));
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
	return [...posts].sort((a, b) => {
		const aValue = a.publishedAt?.valueOf() ?? 0;
		const bValue = b.publishedAt?.valueOf() ?? 0;
		return bValue - aValue;
	});
}

export function groupPostsByArea(posts: BlogPost[]): Array<{ area: string; posts: BlogPost[] }> {
	const bucket = new Map<string, { area: string; posts: BlogPost[] }>();
	for (const post of posts) {
		const areaKey = post.areaKey || normalizeAreaKey(post.area);
		const group = bucket.get(areaKey) ?? {
			area: post.area || areaLabel(areaKey),
			posts: [],
		};
		group.posts.push(post);
		bucket.set(areaKey, group);
	}
	return [...bucket.values()]
		.map((group) => ({ area: group.area, posts: sortPostsByDate(group.posts) }))
		.sort((a, b) => b.posts.length - a.posts.length);
}

export function buildPostMap(posts: BlogPost[]): Map<string, BlogPost> {
	const map = new Map<string, BlogPost>();
	for (const post of posts) {
		map.set(post.slugKey, post);
		map.set(normalizeSlug(post.id), post);
	}
	return map;
}
