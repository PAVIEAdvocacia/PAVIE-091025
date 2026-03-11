import type { CollectionEntry } from 'astro:content';
import { BLOG_SITE_URL, DEFAULT_AUTHOR_NAME, DEFAULT_AUTHOR_ROLE } from '../consts';
import { PRIMARY_CTA_OPTIONS } from './editorial-taxonomy';
import { areaLabel, normalizeAreaKey, normalizeTemaKey } from './taxonomy';

export type RawPostEntry = CollectionEntry<'blog'>;

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
	subarea?: string;
	temas: string[];
	temaKeys: string[];
	painPoints: string[];
	tags: string[];
	funnelStage: string;
	authorName: string;
	authorRole: string;
	publishedAt?: Date;
	updatedAt?: Date;
	image?: string;
	imageAlt: string;
	readingTime: number;
	audioStatus: 'none' | 'planned' | 'published';
	audioUrl?: string;
	transcriptUrl?: string;
	ctaKey: string;
	cta: CtaConfig;
	relatedArticles: string[];
	faqItems: FaqItem[];
	status: string;
	featured: boolean;
	canonicalUrl?: string;
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
	return Array.from(new Map(values.filter(Boolean).map((value) => [value.toLowerCase(), value])).values());
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

function normalizeImagePath(rawValue: string): string | undefined {
	const value = rawValue.trim();
	if (!value) return undefined;
	if (/^https?:\/\//i.test(value)) return value;
	const normalized = value.replace(/\\/g, '/');
	if (normalized.startsWith('/')) return normalized;
	if (normalized.startsWith('blog/public/')) {
		return `/${normalized.replace('blog/public/', '')}`;
	}
	if (normalized.startsWith('public/')) {
		return `/${normalized.replace('public/', '')}`;
	}
	const uploadsIndex = normalized.indexOf('/uploads/');
	if (uploadsIndex >= 0) {
		return normalized.slice(uploadsIndex);
	}
	if (normalized.startsWith('uploads/')) {
		return `/${normalized}`;
	}
	return undefined;
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

function resolveStatus(rawValue: string): string {
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

function resolvePrimaryCtaKey(rawValue: string, funnelStage: string): string {
	const key = rawValue.toLowerCase();
	if (PRIMARY_CTA_BY_KEY[key]) {
		return key;
	}
	return defaultPrimaryCtaKey(funnelStage);
}

function resolvePrimaryCta(key: string): CtaConfig {
	return PRIMARY_CTA_BY_KEY[key] ?? PRIMARY_CTA_BY_KEY.areas_editoriais;
}

export function postRoute(slug: string): string {
	return `/blog/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function isPublicPost(post: BlogPost): boolean {
	return post.status === 'published' && Boolean(post.slug) && Boolean(post.publishedAt);
}

export function normalizePost(entry: RawPostEntry): BlogPost {
	const data = entry.data;
	const title = cleanString(data.title) || 'Publicacao sem titulo';
	const description = ensureDescription(title, cleanString(data.description));
	const excerpt = cleanString(data.excerpt) || description;
	const routeSlug = cleanString(data.slug) || entry.id;
	const slug = routeSlug.replace(/^\/+|\/+$/g, '');
	const slugKey = normalizeSlug(slug || entry.id);
	const areaValue = cleanString(data.area) || 'Familia, Sucessoes e Patrimonio';
	const areaKey = normalizeAreaKey(areaValue);
	const area = areaLabel(areaValue);
	const subarea = cleanString(data.subarea) || undefined;
	const themes = cleanList(data.themes);
	const painPoints = cleanList(data.pain_points);
	const derivedThemes = themes.length > 0 ? themes : inferThemes(title, description);
	const temaKeys = derivedThemes.map((item) => normalizeTemaKey(item));
	const authorName = cleanString(data.author) || DEFAULT_AUTHOR_NAME;
	const publishedAt = parseDate(data.publish_date);
	const readingTime = buildReadingTime(entry.body, data.reading_time);
	const image = normalizeImagePath(cleanString(data.og_image));
	const imageAlt = `Imagem de capa do artigo ${title}`;
	const funnelStage = cleanString(data.funnel_stage) || 'consideracao';
	const ctaKey = resolvePrimaryCtaKey(cleanString(data.primary_cta), funnelStage);
	const relatedArticles = cleanList(data.related_articles).map((item) => normalizeSlug(item));
	const status = resolveStatus(cleanString(data.status));
	const featured = Boolean(data.featured);
	const seoTitle = cleanString(data.seo_title) || undefined;
	const canonicalUrl = `${BLOG_SITE_URL}${postRoute(slug)}`;
	const tags = uniqueList([...derivedThemes, ...painPoints, ...(subarea ? [subarea] : [])]);

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
		subarea,
		temas: derivedThemes,
		temaKeys,
		painPoints,
		tags,
		funnelStage,
		authorName,
		authorRole: DEFAULT_AUTHOR_ROLE,
		publishedAt,
		updatedAt: undefined,
		image,
		imageAlt,
		readingTime,
		audioStatus: 'none',
		audioUrl: undefined,
		transcriptUrl: undefined,
		ctaKey,
		cta: resolvePrimaryCta(ctaKey),
		relatedArticles,
		faqItems: [],
		status,
		featured,
		canonicalUrl,
	};
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
		const group = bucket.get(areaKey) ?? { area: post.area || areaLabel(areaKey), posts: [] };
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
