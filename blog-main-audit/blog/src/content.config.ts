import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
	EDITORIAL_AREA_LABELS,
	EDITORIAL_AUTHORS,
	EDITORIAL_FUNNEL_STAGES,
	EDITORIAL_STATUSES,
	PRIMARY_CTA_KEYS,
} from './lib/editorial-taxonomy';

const areaOptions = [...EDITORIAL_AREA_LABELS] as [string, ...string[]];
const authorOptions = [...EDITORIAL_AUTHORS] as [string, ...string[]];
const funnelStageOptions = [...EDITORIAL_FUNNEL_STAGES] as [string, ...string[]];
const statusOptions = [...EDITORIAL_STATUSES] as [string, ...string[]];
const primaryCtaOptions = [...PRIMARY_CTA_KEYS] as [string, ...string[]];

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			slug: z.string(),
			description: z.string(),
			area: z.enum(areaOptions),
			publish_date: z.coerce.date(),
			author: z.enum(authorOptions),
			status: z.enum(statusOptions),
			funnel_stage: z.enum(funnelStageOptions),
			excerpt: z.string().optional(),
			subarea: z.string().optional(),
			themes: z.union([z.array(z.string()), z.string()]).optional(),
			pain_points: z.union([z.array(z.string()), z.string()]).optional(),
			related_articles: z.union([z.array(z.string()), z.string()]).optional(),
			primary_cta: z.enum(primaryCtaOptions).optional(),
			seo_title: z.string().optional(),
			og_image: z.string().optional(),
			reading_time: z.coerce.number().optional(),
			featured: z.boolean().optional(),
		}),
});

export const collections = { blog };
