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
			area: z.string().optional(),
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
			reading_time: z.coerce.number().optional(),
			audio_status: z.string().optional(),
			audio_url: z.string().optional(),
			transcript_url: z.string().optional(),
			cta_variant: z.string().optional(),
			related_manual: z.union([z.array(z.string()), z.string()]).optional(),
			tags: z.array(z.string()).optional(),
			publish_status: z.string().optional(),
			update_status: z.string().optional(),
			canonical_url: z.string().optional(),
			trace_ref: z.string().optional(),
		}),
});

export const collections = { blog };
