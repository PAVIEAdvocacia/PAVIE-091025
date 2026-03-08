import type { MarkdownHeading } from 'astro';

export interface TocItem {
	id: string;
	text: string;
	depth: number;
	number: string;
}

export function buildToc(headings: MarkdownHeading[]): TocItem[] {
	const filtered = headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
	return filtered.map((heading, index) => ({
		id: heading.slug,
		text: heading.text,
		depth: heading.depth,
		number: String(index + 1).padStart(2, '0'),
	}));
}
