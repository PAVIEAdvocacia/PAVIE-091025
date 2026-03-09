import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			slug: z.string().optional(),
			description: z.string().optional(),
			excerpt: z.string().optional(),
			editorial_item_id: z.string().optional(),
			area: z.string().optional(),
			hub: z.string().optional(),
			tema: z.union([z.array(z.string()), z.string()]).optional(),
			content_type: z.string().optional(),
			intent: z.string().optional(),
			funnel_stage: z.string().optional(),
			author_ref: z.string().optional(),
			author_name: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			published_at: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			updated_at: z.coerce.date().optional(),
			heroImage: z.string().optional(),
			heroImageAlt: z.string().optional(),
			featured_image: z.string().optional(),
			featured_image_alt: z.string().optional(),
			subtitle: z.string().optional(),
			hero_kicker: z.string().optional(),
			reading_time: z.coerce.number().optional(),
			audio_status: z.string().optional(),
			audio_url: z.string().optional(),
			audio_duration: z.string().optional(),
			transcript_url: z.string().optional(),
			cta_variant: z.string().optional(),
			related_manual: z.union([z.array(z.string()), z.string()]).optional(),
			tags: z.array(z.string()).optional(),
			publish_status: z.string().optional(),
			update_status: z.string().optional(),
			canonical_url: z.string().optional(),
			jurisdiction_scope: z.string().optional(),
			faq_enabled: z.boolean().optional(),
			faq_items: z
				.array(
					z.object({
						question: z.string(),
						answer: z.string(),
					}),
				)
				.optional(),
			disclaimer_variant: z.string().optional(),
			series_ref: z.string().optional(),
			instagram_hook: z.string().optional(),
			lead_intent_hint: z.string().optional(),
			trace_ref: z.string().optional(),
		}),
});

const areas = defineCollection({
	loader: glob({ base: './src/content/taxonomy/areas', pattern: '**/*.md' }),
	schema: () =>
		z.object({
			title: z.string(),
			slug: z.string(),
			description: z.string().optional(),
			order: z.coerce.number().optional(),
			active: z.boolean().optional(),
		}),
});

const hubs = defineCollection({
	loader: glob({ base: './src/content/taxonomy/hubs', pattern: '**/*.md' }),
	schema: () =>
		z.object({
			title: z.string(),
			slug: z.string(),
			area: z.string(),
			description: z.string().optional(),
			order: z.coerce.number().optional(),
			active: z.boolean().optional(),
		}),
});

const themes = defineCollection({
	loader: glob({ base: './src/content/taxonomy/themes', pattern: '**/*.md' }),
	schema: () =>
		z.object({
			title: z.string(),
			slug: z.string(),
			area: z.string(),
			hub: z.string().optional(),
			description: z.string().optional(),
			active: z.boolean().optional(),
		}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.md' }),
	schema: () =>
		z.object({
			name: z.string(),
			slug: z.string(),
			oab: z.string().optional(),
			role: z.string().optional(),
			bio: z.string().optional(),
			image: z.string().optional(),
			areas: z.array(z.string()).optional(),
			experience_years: z.coerce.number().optional(),
		}),
});

export const collections = { blog, areas, hubs, themes, authors };
