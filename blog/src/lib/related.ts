import type { BlogPost } from './posts';
import { normalizeSlug } from './posts';

interface ScoredPost {
	post: BlogPost;
	score: number;
}

function intersectionSize(a: string[], b: string[]): number {
	if (!a.length || !b.length) return 0;
	const setA = new Set(a.map((item) => item.toLowerCase()));
	let hits = 0;
	for (const value of b) {
		if (setA.has(value.toLowerCase())) {
			hits += 1;
		}
	}
	return hits;
}

function relevanceScore(current: BlogPost, candidate: BlogPost): number {
	let score = 0;
	if (current.areaKey === candidate.areaKey) score += 6;
	score += intersectionSize(current.temaKeys, candidate.temaKeys) * 3;
	score += intersectionSize(current.tags, candidate.tags) * 2;
	if (current.contentType === candidate.contentType) score += 1;
	if (current.intent === candidate.intent) score += 1;
	if (current.funnelStage === candidate.funnelStage) score += 1;
	if (candidate.publishedAt) score += 0.5;
	return score;
}

export function getRelatedPosts(
	posts: BlogPost[],
	current: BlogPost,
	maxItems = 3,
): BlogPost[] {
	const key = normalizeSlug(current.slug);
	const byKey = new Map<string, BlogPost>();

	for (const post of posts) {
		byKey.set(normalizeSlug(post.slug), post);
		byKey.set(normalizeSlug(post.id), post);
	}

	const manual: BlogPost[] = [];
	for (const manualKey of current.relatedManual) {
		const item = byKey.get(normalizeSlug(manualKey));
		if (item && normalizeSlug(item.slug) !== key) {
			manual.push(item);
		}
	}

	const manualSet = new Set(manual.map((post) => normalizeSlug(post.slug)));
	const scored: ScoredPost[] = posts
		.filter((post) => normalizeSlug(post.slug) !== key)
		.filter((post) => !manualSet.has(normalizeSlug(post.slug)))
		.map((post) => ({ post, score: relevanceScore(current, post) }))
		.filter((item) => item.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			const aDate = a.post.publishedAt?.valueOf() ?? 0;
			const bDate = b.post.publishedAt?.valueOf() ?? 0;
			return bDate - aDate;
		});

	const output = [...manual];
	for (const item of scored) {
		if (output.length >= maxItems) break;
		output.push(item.post);
	}

	return output.slice(0, maxItems);
}
