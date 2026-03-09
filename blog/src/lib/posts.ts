import type { CollectionEntry } from 'astro:content';
import { BLOG_SITE_URL, DEFAULT_AUTHOR_NAME, DEFAULT_AUTHOR_ROLE, DEFAULT_CTA } from '../consts';
import { areaLabel, normalizeAreaKey, normalizeTemaKey } from './taxonomy';

export type RawPostEntry = CollectionEntry<'blog'>;

export interface CtaConfig {
	label: string;
	href: string;
	description: string;
}

export interface BlogPost {
	entry: RawPostEntry;
	id: string;
	slug: string;
	slugKey: string;
	url: string;
	title: string;
	description: string;
	excerpt: string;
	area: string;
	areaKey: string;
	temas: string[];
	temaKeys: string[];
	tags: string[];
	contentType: string;
	intent: string;
	funnelStage: string;
	editorialItemId?: string;
	authorRef: string;
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
	ctaVariant: string;
	cta: CtaConfig;
	relatedManual: string[];
	publishStatus: string;
	updateStatus?: string;
	canonicalUrl?: string;
	traceRef?: string;
}

const AREA_FALLBACK = 'Direito e Patrimonio';
const THEME_SPLIT_PATTERN = /[,;|]/;
const WORDS_PER_MINUTE = 220;

const CTA_BY_VARIANT: Record<string, CtaConfig> = {
	consultoria: DEFAULT_CTA,
	diagnostico: {
		label: 'Solicitar Diagnostico Juridico',
		href: '/contato/',
		description: 'Receba uma avaliacao inicial para entender riscos, prazos e estrategia.',
	},
	aprofundamento: {
		label: 'Ver Publicacoes Relacionadas',
		href: '/blog/',
		description: 'Continue estudando o tema com artigos relacionados.',
	},
	leitura_relacionada: {
		label: 'Ver Publicacoes Relacionadas',
		href: '/blog/',
		description: 'Continue estudando o tema com artigos relacionados.',
	},
	checklist: {
		label: 'Solicitar Checklist Aplicavel',
		href: '/contato/',
		description: 'Receba um roteiro inicial para organizar sua proxima decisao juridica.',
	},
	contato: {
		label: 'Falar com a PAVIE',
		href: '/contato/',
		description: 'Entre em contato para avaliar o melhor caminho para o seu caso.',
	},
	calculadora: {
		label: 'Agendar Simulacao Juridica',
		href: '/contato/',
		description: 'Solicite uma simulacao orientada para apoiar sua tomada de decisao.',
	},
	institucional: {
		label: 'Conhecer Areas de Atuacao',
		href: '/areas/',
		description: 'Veja como a PAVIE atua em sucessoes, familia e organizacao patrimonial.',
	},
};

function cleanString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function cleanList(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((item) => cleanString(item)).filter(Boolean);
	}
	if (typeof value === 'string') {
		return value
			.split(THEME_SPLIT_PATTERN)
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
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

function inferArea(title: string, description: string): string {
	const source = `${title} ${description}`.toLowerCase();
	if (source.includes('inventario') || source.includes('sucess')) {
		return 'Planejamento Sucessorio';
	}
	if (source.includes('divorcio') || source.includes('famil')) {
		return 'Familia e Patrimonio';
	}
	if (source.includes('imovel') || source.includes('cartorio')) {
		return 'Direito Imobiliario';
	}
	return AREA_FALLBACK;
}

function inferTemas(title: string, description: string): string[] {
	const source = `${title} ${description}`.toLowerCase();
	const temas: string[] = [];
	if (source.includes('inventario')) temas.push('inventario');
	if (source.includes('itcmd')) temas.push('itcmd');
	if (source.includes('divorcio')) temas.push('divorcio');
	if (source.includes('herdeir')) temas.push('heranca');
	if (source.includes('partilha')) temas.push('partilha');
	return temas;
}

function ensureDescription(title: string, description: string): string {
	if (description) return description;
	return `Analise juridica da PAVIE sobre ${title.toLowerCase()}.`;
}

function resolveCtaByVariant(variant: string): CtaConfig {
	if (CTA_BY_VARIANT[variant]) {
		return CTA_BY_VARIANT[variant];
	}
	return DEFAULT_CTA;
}

function resolvePublishedStatus(rawValue: string): string {
	const value = rawValue.toLowerCase();
	if (!value) return 'draft';
	if (['published', 'publicado', 'active'].includes(value)) return 'published';
	if (['draft', 'rascunho'].includes(value)) return 'draft';
	if (['review', 'revisao'].includes(value)) return 'review';
	if (['scheduled', 'agendado'].includes(value)) return 'scheduled';
	if (['archived', 'arquivado'].includes(value)) return 'archived';
	return value;
}

export function postRoute(slug: string): string {
	return `/blog/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function isPublicPost(post: BlogPost): boolean {
	return (
		post.publishStatus === 'published' &&
		Boolean(post.slug) &&
		Boolean(post.publishedAt)
	);
}

export function normalizePost(entry: RawPostEntry): BlogPost {
	const data = entry.data;
	const title = cleanString(data.title) || 'Publicacao sem titulo';
	const description = ensureDescription(title, cleanString(data.description));
	const excerpt = cleanString(data.excerpt) || description;
	const routeSlug = cleanString(data.slug) || entry.id;
	const slug = routeSlug.replace(/^\/+|\/+$/g, '');
	const slugKey = normalizeSlug(slug || entry.id);
	const area = cleanString(data.area) || inferArea(title, description);
	const areaKey = normalizeAreaKey(area);
	const areaDisplay = areaLabel(area);
	const temas = cleanList(data.tema);
	const tags = cleanList(data.tags);
	const contentType = cleanString(data.content_type) || 'artigo';
	const intent = cleanString(data.intent) || 'informativo';
	const funnelStage = cleanString(data.funnel_stage) || 'consideracao';
	const editorialItemId = cleanString(data.editorial_item_id) || undefined;
	const authorRef = cleanString(data.author_ref) || 'dr-fabio-pavie';
	const authorName = cleanString(data.author_name) || DEFAULT_AUTHOR_NAME;
	const authorRole = DEFAULT_AUTHOR_ROLE;
	const publishedAt = parseDate(data.published_at) ?? parseDate(data.pubDate);
	const updatedAt = parseDate(data.updated_at) ?? parseDate(data.updatedDate);
	const explicitImage = cleanString(data.featured_image) || cleanString(data.heroImage);
	const image = normalizeImagePath(explicitImage);
	const imageAlt =
		cleanString(data.featured_image_alt) ||
		cleanString(data.heroImageAlt) ||
		`Imagem de capa do artigo ${title}`;
	const readingTime = buildReadingTime(entry.body, data.reading_time);
	const rawAudioStatus = cleanString(data.audio_status).toLowerCase();
	const audioStatus: BlogPost['audioStatus'] =
		rawAudioStatus === 'published'
			? 'published'
			: rawAudioStatus === 'available'
				? 'published'
			: rawAudioStatus === 'planned'
				? 'planned'
				: 'none';
	const audioUrl = cleanString(data.audio_url) || undefined;
	const transcriptUrl = cleanString(data.transcript_url) || undefined;
	const ctaVariant = cleanString(data.cta_variant).toLowerCase() || 'consultoria';
	const relatedManual = cleanList(data.related_manual).map((item) => normalizeSlug(item));
	const publishStatus = resolvePublishedStatus(cleanString(data.publish_status));
	const updateStatus = cleanString(data.update_status) || undefined;
	const canonicalInput = cleanString(data.canonical_url);
	const canonicalUrl = canonicalInput || `${BLOG_SITE_URL}${postRoute(slug)}`;
	const traceRef = cleanString(data.trace_ref) || undefined;
	const derivedTemas = temas.length > 0 ? temas : inferTemas(title, description);
	const temaKeys = derivedTemas.map((item) => normalizeTemaKey(item));
	const allTags = tags.length > 0 ? tags : [...derivedTemas];

	return {
		entry,
		id: entry.id,
		slug,
		slugKey,
		url: postRoute(slug),
		title,
		description,
		excerpt,
		area: areaDisplay,
		areaKey,
		temas: derivedTemas,
		temaKeys,
		tags: allTags,
		contentType,
		intent,
		funnelStage,
		editorialItemId,
		authorRef,
		authorName,
		authorRole,
		publishedAt,
		updatedAt,
		image,
		imageAlt,
		readingTime,
		audioStatus,
		audioUrl,
		transcriptUrl,
		ctaVariant,
		cta: resolveCtaByVariant(ctaVariant),
		relatedManual,
		publishStatus,
		updateStatus,
		canonicalUrl,
		traceRef,
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
		const areaKey = post.areaKey || normalizeAreaKey(post.area || AREA_FALLBACK);
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
