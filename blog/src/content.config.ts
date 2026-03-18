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
const optionalStringList = z.array(z.string()).optional();

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
				seoTitle: z.string().min(12).optional(),
				seo_title: z.string().min(12).optional(),
				description: z.string().min(50),
				excerpt: z.string().min(50).optional(),
				slug: z.string().min(3),
				legacySlug: z.string().optional(),
				publishDate: z.coerce.date().optional(),
				publish_date: z.coerce.date().optional(),
				updatedDate: z.coerce.date().optional(),
				authorId: z.enum(authorIdOptions).optional(),
				author: z.string().optional(),
				categoryCode: z.enum(categoryCodeOptions).optional(),
				legacyAreaKey: legacyAreaSchema.optional(),
				area: legacyAreaSchema.optional(),
				contentType: z.enum(contentTypeOptions).optional(),
				readerStage: z.enum(readerStageOptions).optional(),
				funnel_stage: z.enum(legacyFunnelStageOptions).optional(),
				ctaType: z.enum(ctaTypeOptions).optional(),
				ctaTarget: z.string().optional(),
				primary_cta: z.enum(legacyPrimaryCtaOptions).optional(),
				draft: z.boolean().optional(),
				noindex: z.boolean().optional(),
				status: z.enum(legacyStatusOptions).optional(),
				featured: z.boolean().optional(),
				legalReview: z.enum(reviewStatusOptions).optional(),
				editorialReview: z.enum(reviewStatusOptions).optional(),
				reviewStatus: z.enum(reviewStatusOptions).optional(),
				migrationStatus: z.enum(migrationStatusOptions).optional(),
				subarea: z.string().optional(),
				themes: listOrString.optional(),
				tags: optionalStringList,
				keywords: optionalStringList,
				pain_points: listOrString.optional(),
				relatedPosts: optionalStringList,
				relatedAreas: optionalStringList,
				related_articles: listOrString.optional(),
				canonicalURL: z.string().optional(),
				canonicalUrl: z.string().optional(),
				schemaType: z.enum(['Article', 'BlogPosting']).optional(),
				coverImage: z.string().optional(),
				coverAlt: z.string().optional(),
				og_image: z.string().optional(),
				readingTime: z.coerce.number().optional(),
				reading_time: z.coerce.number().optional(),
				legacyId: z.string().optional(),
				redirectFrom: z.array(z.string()).optional(),
			})
			.superRefine((data, ctx) => {
				const hasCanonicalCore =
					Boolean(data.seoTitle) &&
					Boolean(data.excerpt) &&
					Boolean(data.publishDate) &&
					Boolean(data.authorId) &&
					Boolean(data.categoryCode) &&
					Boolean(data.contentType) &&
					Boolean(data.readerStage) &&
					Boolean(data.ctaType) &&
					Boolean(data.ctaTarget);

				const hasLegacyCore =
					Boolean(data.publish_date) &&
					Boolean(data.author) &&
					Boolean(data.area) &&
					Boolean(data.status) &&
					Boolean(data.funnel_stage);

				if (!hasCanonicalCore && !hasLegacyCore) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							'Use o frontmatter canônico completo ou o conjunto mínimo legado compatível.',
					});
				}

				if (data.coverImage && !data.coverAlt) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['coverAlt'],
						message: 'coverAlt é obrigatório quando houver coverImage.',
					});
				}

				if (data.ctaType && !data.ctaTarget) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['ctaTarget'],
						message: 'ctaTarget é obrigatório quando ctaType estiver preenchido.',
					});
				}
			}),
});

const areas = defineCollection({
	loader: glob({ base: './src/content/areas', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string().min(12),
		slug: z.string().min(3),
		categoryCode: z.enum(categoryCodeOptions),
		shortDescription: z.string().min(30),
		headline: z.string().min(12),
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
		image: z.string().min(1),
		imageAlt: z.string().min(3),
		reviewStatus: z.enum(reviewStatusOptions),
	}),
});

export const collections = { posts, areas, authors };
