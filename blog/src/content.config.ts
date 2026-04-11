import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
	AUTHOR_IDS,
	CANONICAL_CATEGORY_CODES,
	CONTENT_TYPE_OPTIONS,
	CTA_TYPE_OPTIONS,
	LEGACY_FUNNEL_STAGE_OPTIONS,
	LEGACY_PRIMARY_CTA_OPTIONS,
	LEGACY_PUBLICATION_STATUS_OPTIONS,
	MIGRATION_STATUS_OPTIONS,
	READER_STAGE_OPTIONS,
	REVIEW_STATUS_OPTIONS,
} from './lib/canonical-content';
import { normalizeCmsImagePath } from './lib/content-media';
import { EDITORIAL_AREA_KEYS } from './lib/editorial-taxonomy';
import { normalizeAreaKey } from './lib/taxonomy';

const categoryCodeOptions = [...CANONICAL_CATEGORY_CODES] as [string, ...string[]];
const authorIdOptions = [...AUTHOR_IDS] as [string, ...string[]];
const contentTypeOptions = [...CONTENT_TYPE_OPTIONS] as [string, ...string[]];
const readerStageOptions = [...READER_STAGE_OPTIONS] as [string, ...string[]];
const ctaTypeOptions = [...CTA_TYPE_OPTIONS] as [string, ...string[]];
const reviewStatusOptions = [...REVIEW_STATUS_OPTIONS] as [string, ...string[]];
const migrationStatusOptions = [...MIGRATION_STATUS_OPTIONS] as [string, ...string[]];
const legacyStatusOptions = [...LEGACY_PUBLICATION_STATUS_OPTIONS] as [string, ...string[]];
const legacyFunnelStageOptions = [...LEGACY_FUNNEL_STAGE_OPTIONS] as [string, ...string[]];
const legacyPrimaryCtaOptions = [...LEGACY_PRIMARY_CTA_OPTIONS] as [string, ...string[]];
const legacyAreaOptions = [...EDITORIAL_AREA_KEYS] as [string, ...string[]];
const legacyAreaOptionSet = new Set(legacyAreaOptions);
const listOrString = z.union([z.array(z.string()), z.string()]);
const schemaTypeOptions = ['Article', 'BlogPosting'] as const;

function isCanonicalPublicImagePath(value: string): boolean {
	if (/^https?:\/\//i.test(value)) return true;
	return normalizeCmsImagePath(value) === value.trim();
}

const legacyAreaSchema = z
	.string()
	.trim()
	.transform((value) => normalizeAreaKey(value))
	.refine((value) => legacyAreaOptionSet.has(value), {
		message: `Use uma das areas legadas suportadas: ${legacyAreaOptions.join(', ')}`,
	});

const posts = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z
			.object({
				title: z.string().min(12),
				seoTitle: z.string().min(12),
				seo_title: z.string().min(12).optional(),
				description: z.string().min(50),
				excerpt: z.string().min(50),
				slug: z.string().min(3),
				legacySlug: z.string().optional(),
				publishDate: z.coerce.date(),
				publish_date: z.coerce.date().optional(),
				updatedAt: z.coerce.date().optional(),
				updatedDate: z.coerce.date().optional(),
				authorId: z.enum(authorIdOptions),
				author: z.string().optional(),
				categoryCode: z.enum(categoryCodeOptions),
				legacyAreaKey: legacyAreaSchema.optional(),
				area: legacyAreaSchema.optional(),
				contentType: z.enum(contentTypeOptions),
				readerStage: z.enum(readerStageOptions),
				funnel_stage: z.enum(legacyFunnelStageOptions).optional(),
				ctaType: z.enum(ctaTypeOptions),
				ctaTarget: z.string().min(1),
				primary_cta: z.enum(legacyPrimaryCtaOptions).optional(),
				draft: z.boolean().default(true),
				noindex: z.boolean().default(true),
				status: z.enum(legacyStatusOptions).optional(),
				featured: z.boolean().default(false),
				legalReview: z.enum(reviewStatusOptions).default('pending'),
				editorialReview: z.enum(reviewStatusOptions).default('pending'),
				reviewStatus: z.enum(reviewStatusOptions).optional(),
				migrationStatus: z.enum(migrationStatusOptions).default('native'),
				subarea: z.string().optional(),
				themes: listOrString.optional(),
				tags: z.array(z.string()).default([]),
				keywords: z.array(z.string()).default([]),
				pain_points: listOrString.optional(),
				relatedPosts: z.array(z.string()).default([]),
				relatedAreas: z.array(z.string()).default([]),
				related_articles: listOrString.optional(),
				canonicalUrl: z.string().optional(),
				canonicalURL: z.string().optional(),
				schemaType: z.enum(schemaTypeOptions).default('BlogPosting'),
				coverImage: z.string().optional(),
				coverImageAlt: z.string().optional(),
				coverAlt: z.string().optional(),
				og_image: z.string().optional(),
				readingTime: z.coerce.number().optional(),
				reading_time: z.coerce.number().optional(),
				legacyId: z.string().optional(),
				redirectFrom: z.array(z.string()).optional(),
			})
			.superRefine((data, ctx) => {
				const coverImageAlt = data.coverImageAlt ?? data.coverAlt;

				if (data.coverImage && !coverImageAlt) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['coverImageAlt'],
						message: 'coverImageAlt e obrigatorio quando houver coverImage.',
					});
				}

				if (data.coverImage && !isCanonicalPublicImagePath(data.coverImage)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['coverImage'],
						message: 'Use caminho publico canonico, como /uploads/arquivo.ext, para coverImage.',
					});
				}

				if (data.draft && data.noindex === false) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['noindex'],
						message: 'Rascunhos devem permanecer com noindex ativado.',
					});
				}

				if (!data.draft && data.legalReview !== 'reviewed') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['legalReview'],
						message: 'Posts publicaveis exigem revisao juridica concluida.',
					});
				}

				if (!data.draft && data.editorialReview !== 'reviewed') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['editorialReview'],
						message: 'Posts publicaveis exigem revisao editorial concluida.',
					});
				}
			}),
});

const areas = defineCollection({
	loader: glob({ base: './src/content/areas', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string().min(12),
		canonicalTitle: z.string().min(12).optional(),
		displayTitle: z.string().min(3).optional(),
		slug: z.string().min(3),
		categoryCode: z.enum(categoryCodeOptions),
		shortDescription: z.string().min(30),
		headline: z.string().min(12),
		heroTitle: z.string().min(12).optional(),
		heroDescription: z.string().min(50).optional(),
		framingTitle: z.string().min(3).optional(),
		framingText: z.array(z.string().min(20)).default([]),
		criteria: z.array(z.string().min(10)).default([]),
		documentsTitle: z.string().min(3).optional(),
		documents: z.array(z.string().min(10)).default([]),
		documentsNote: z.string().min(10).optional(),
		cautionsTitle: z.string().min(3).optional(),
		cautionsIntro: z.string().min(10).optional(),
		cautions: z.array(z.string().min(10)).default([]),
		faqTitle: z.string().min(3).optional(),
		faqItems: z
			.array(
				z.object({
					question: z.string().min(10),
					answer: z.string().min(20),
				}),
			)
			.default([]),
		readingTitle: z.string().min(3).optional(),
		readingDescription: z.string().min(20).optional(),
		readingCategoryLabel: z.string().min(3).optional(),
		finalTitle: z.string().min(3).optional(),
		finalText: z.string().min(20).optional(),
		finalCtaLabel: z.string().min(3).optional(),
		ctaType: z.enum(ctaTypeOptions),
		ctaTarget: z.string().min(1),
		seoTitle: z.string().min(12),
		description: z.string().min(50),
		order: z.coerce.number().int().min(1),
		isActive: z.boolean().default(true),
		reviewStatus: z.enum(reviewStatusOptions),
	}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.md' }),
	schema: z.object({
		id: z.enum(authorIdOptions),
		name: z.string().min(3),
		slug: z.string().min(3),
		shortBio: z.string().min(20),
		extendedBio: z.string().min(20),
		oab: z.string().min(3),
		image: z
			.string()
			.min(1)
			.refine((value) => isCanonicalPublicImagePath(value), {
				message: 'Use caminho publico canonico, como /uploads/arquivo.ext, para a imagem do autor.',
			}),
		imageAlt: z.string().min(3),
		reviewStatus: z.enum(reviewStatusOptions),
	}),
});

export const collections = { posts, areas, authors };
