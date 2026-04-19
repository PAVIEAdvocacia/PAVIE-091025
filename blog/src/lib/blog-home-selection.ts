import type { BlogPost } from './posts';

type B1Block = 'primary' | 'useful' | 'recent';

interface B1ManualOverride {
	block?: B1Block;
	editorialPriority?: number;
	manualLock?: boolean;
	lastReviewedAt?: string;
	reviewNote?: string;
	performanceSupportScore?: number;
}

export interface B1EditorialCandidate {
	post: BlogPost;
	isEligibleB1: boolean;
	editorialPriority: number;
	journeyStageFit: number;
	categoryCoverageNeed: number;
	areaReturnStrength: number;
	readingUtilityScore: number;
	freshnessScore: number;
	performanceSupportScore: number;
	featuredStatus: boolean;
	manualLock: boolean;
	lastReviewedAt?: string;
	reviewNote: string;
	score: number;
	preferredBlock?: B1Block;
}

export interface B1Selection {
	candidates: B1EditorialCandidate[];
	primaryHighlights: BlogPost[];
	usefulReads: BlogPost[];
	recentReads: BlogPost[];
	schemaPosts: BlogPost[];
}

const B1_SCORE_WEIGHTS = {
	editorialPriority: 0.25,
	areaReturnStrength: 0.2,
	journeyStageFit: 0.15,
	categoryCoverageNeed: 0.15,
	readingUtilityScore: 0.1,
	freshnessScore: 0.1,
	performanceSupportScore: 0.05,
} as const;

// Manual overrides stay in code until there is a governed CMS/settings surface for B1.
const B1_MANUAL_OVERRIDES: Record<string, B1ManualOverride> = {};

function clampScore(value: number): number {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(100, value));
}

function dateToReviewLabel(value?: Date): string | undefined {
	if (!value || Number.isNaN(value.valueOf())) return undefined;
	return value.toISOString().slice(0, 10);
}

function daysBetween(later: number, earlier: number): number {
	return Math.max(0, (later - earlier) / (1000 * 60 * 60 * 24));
}

function contentTypePriority(contentType?: string): number {
	switch (contentType) {
		case 'cornerstone':
			return 88;
		case 'guide':
			return 82;
		case 'checklist':
			return 76;
		case 'faq':
			return 68;
		case 'spoke':
			return 60;
		case 'case-note':
			return 52;
		case 'institutional':
			return 35;
		default:
			return 45;
	}
}

function journeyStageScore(readerStage?: string): number {
	switch (readerStage) {
		case 'discover':
			return 100;
		case 'clarify':
			return 90;
		case 'compare':
			return 72;
		case 'decide':
			return 45;
		default:
			return 65;
	}
}

function readingUtilityScore(post: BlogPost): number {
	const baseByType: Record<string, number> = {
		checklist: 95,
		guide: 90,
		cornerstone: 86,
		faq: 82,
		spoke: 72,
		'case-note': 64,
		institutional: 42,
	};
	const typeScore = baseByType[post.contentType ?? ''] ?? 58;
	const readingTimeBonus = post.readingTime >= 3 && post.readingTime <= 12 ? 5 : 0;
	const relatedBonus = post.relatedArticles.length > 0 ? 3 : 0;
	return clampScore(typeScore + readingTimeBonus + relatedBonus);
}

function areaReturnStrength(post: BlogPost): number {
	if (!post.areaUrl) return 0;
	if (post.ctaTarget === post.areaUrl || post.ctaTarget?.startsWith('/areas/')) return 100;
	if (post.ctaType === 'area') return 95;
	if (post.ctaType === 'article-series') return 72;
	if (post.ctaType === 'document-review') return 68;
	if (post.ctaType === 'contact') return 58;
	return 55;
}

function freshnessScore(post: BlogPost, newestPublishedAt: number): number {
	const publishedAt = post.publishedAt?.valueOf();
	if (!publishedAt) return 0;
	return clampScore(100 - daysBetween(newestPublishedAt, publishedAt) * 1.8);
}

function categoryCoverageScore(post: BlogPost, categoryCounts: Map<string, number>): number {
	if (!post.categoryCode) return 0;
	const counts = [...categoryCounts.values()];
	if (counts.length <= 1) return 100;

	const minCount = Math.min(...counts);
	const maxCount = Math.max(...counts);
	if (maxCount === minCount) return 100;

	const count = categoryCounts.get(post.categoryCode) ?? maxCount;
	return clampScore(100 - ((count - minCount) / (maxCount - minCount)) * 42);
}

function weightedScore(candidate: Omit<B1EditorialCandidate, 'score'>): number {
	return Math.round(
		(candidate.editorialPriority * B1_SCORE_WEIGHTS.editorialPriority +
			candidate.areaReturnStrength * B1_SCORE_WEIGHTS.areaReturnStrength +
			candidate.journeyStageFit * B1_SCORE_WEIGHTS.journeyStageFit +
			candidate.categoryCoverageNeed * B1_SCORE_WEIGHTS.categoryCoverageNeed +
			candidate.readingUtilityScore * B1_SCORE_WEIGHTS.readingUtilityScore +
			candidate.freshnessScore * B1_SCORE_WEIGHTS.freshnessScore +
			candidate.performanceSupportScore * B1_SCORE_WEIGHTS.performanceSupportScore) * 100,
	) / 100;
}

function contentTypeMaturationRank(contentType?: string): number {
	if (contentType === 'cornerstone') return 3;
	if (contentType === 'guide') return 2;
	if (contentType === 'checklist' || contentType === 'faq') return 1;
	return 0;
}

function compareCandidates(a: B1EditorialCandidate, b: B1EditorialCandidate): number {
	const scoreDiff = b.score - a.score;
	if (scoreDiff !== 0) return scoreDiff;

	const areaDiff = b.areaReturnStrength - a.areaReturnStrength;
	if (areaDiff !== 0) return areaDiff;

	const coverageDiff = b.categoryCoverageNeed - a.categoryCoverageNeed;
	if (coverageDiff !== 0) return coverageDiff;

	const typeDiff =
		contentTypeMaturationRank(b.post.contentType) - contentTypeMaturationRank(a.post.contentType);
	if (typeDiff !== 0) return typeDiff;

	const utilityDiff = b.readingUtilityScore - a.readingUtilityScore;
	if (utilityDiff !== 0) return utilityDiff;

	const freshnessDiff = b.freshnessScore - a.freshnessScore;
	if (freshnessDiff !== 0) return freshnessDiff;

	if (a.manualLock !== b.manualLock) return a.manualLock ? -1 : 1;
	return a.reviewNote.localeCompare(b.reviewNote, 'pt-BR');
}

function sortForUsefulReads(a: B1EditorialCandidate, b: B1EditorialCandidate): number {
	const utilityScoreA = a.readingUtilityScore * 0.6 + a.score * 0.4;
	const utilityScoreB = b.readingUtilityScore * 0.6 + b.score * 0.4;
	const diff = utilityScoreB - utilityScoreA;
	return diff !== 0 ? diff : compareCandidates(a, b);
}

function sortForRecentReads(a: B1EditorialCandidate, b: B1EditorialCandidate): number {
	const aDate = a.post.publishedAt?.valueOf() ?? 0;
	const bDate = b.post.publishedAt?.valueOf() ?? 0;
	return bDate - aDate || compareCandidates(a, b);
}

function uniqueCandidates(candidates: B1EditorialCandidate[]): B1EditorialCandidate[] {
	const seen = new Set<string>();
	return candidates.filter((candidate) => {
		if (seen.has(candidate.post.slug)) return false;
		seen.add(candidate.post.slug);
		return true;
	});
}

function selectBalanced(
	candidates: B1EditorialCandidate[],
	limit: number,
	maxPerCategory: number,
): B1EditorialCandidate[] {
	const selected: B1EditorialCandidate[] = [];
	const sorted = uniqueCandidates(candidates).sort(compareCandidates);

	for (const candidate of sorted) {
		if (selected.length >= limit) break;
		const categoryCode = candidate.post.categoryCode;
		const selectedInCategory = selected.filter((item) => item.post.categoryCode === categoryCode).length;
		const hasAlternativeCategory = sorted.some((item) => {
			return !selected.includes(item) && item.post.categoryCode !== categoryCode;
		});

		if (selectedInCategory >= maxPerCategory && hasAlternativeCategory) continue;
		selected.push(candidate);
	}

	for (const candidate of sorted) {
		if (selected.length >= limit) break;
		if (!selected.includes(candidate)) selected.push(candidate);
	}

	return selected.slice(0, limit);
}

function toPosts(candidates: B1EditorialCandidate[]): BlogPost[] {
	return candidates.map((candidate) => candidate.post);
}

function hasResolvedB1Surface(post: BlogPost): boolean {
	return Boolean(
		post.status === 'published' &&
			!post.noindex &&
			post.publicSurfaceStatus === 'allowed' &&
			post.slug &&
			post.categoryCode &&
			post.categoryUrl &&
			post.areaUrl &&
			post.publishedAt,
	);
}

export function buildB1EditorialCandidates(posts: BlogPost[]): B1EditorialCandidate[] {
	const eligibleInput = posts.filter(hasResolvedB1Surface);
	const newestPublishedAt = Math.max(
		...eligibleInput.map((post) => post.publishedAt?.valueOf() ?? 0),
		0,
	);
	const categoryCounts = eligibleInput.reduce((counts, post) => {
		if (post.categoryCode) counts.set(post.categoryCode, (counts.get(post.categoryCode) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());

	return posts.map((post) => {
		const manualOverride = B1_MANUAL_OVERRIDES[post.slug] ?? {};
		const isEligibleB1 = hasResolvedB1Surface(post);
		const featuredStatus = post.featured;
		const manualLock = Boolean(manualOverride.manualLock ?? featuredStatus);
		const candidateWithoutScore = {
			post,
			isEligibleB1,
			editorialPriority: clampScore(
				manualOverride.editorialPriority ?? (featuredStatus ? 100 : contentTypePriority(post.contentType)),
			),
			journeyStageFit: journeyStageScore(post.readerStage),
			categoryCoverageNeed: categoryCoverageScore(post, categoryCounts),
			areaReturnStrength: areaReturnStrength(post),
			readingUtilityScore: readingUtilityScore(post),
			freshnessScore: newestPublishedAt > 0 ? freshnessScore(post, newestPublishedAt) : 0,
			performanceSupportScore: clampScore(manualOverride.performanceSupportScore ?? 0),
			featuredStatus,
			manualLock,
			lastReviewedAt:
				manualOverride.lastReviewedAt ?? dateToReviewLabel(post.updatedAt ?? post.publishedAt),
			reviewNote:
				manualOverride.reviewNote ??
				(featuredStatus
					? 'Marcado como destaque no frontmatter canonico; prioridade manual preservada.'
					: 'Selecao semiautomatica pela matriz B1 com vinculo area-categoria resolvido.'),
			preferredBlock: manualOverride.block,
		} satisfies Omit<B1EditorialCandidate, 'score'>;

		return {
			...candidateWithoutScore,
			score: weightedScore(candidateWithoutScore),
		};
	});
}

export function buildB1Selection(posts: BlogPost[]): B1Selection {
	const candidates = buildB1EditorialCandidates(posts);
	const eligibleCandidates = candidates.filter((candidate) => candidate.isEligibleB1);
	const lockedPrimary = eligibleCandidates.filter((candidate) => {
		return candidate.manualLock || candidate.preferredBlock === 'primary';
	});
	const primaryPool = uniqueCandidates([...lockedPrimary, ...eligibleCandidates]);
	const primaryCandidates = selectBalanced(primaryPool, 3, 2);
	const primarySlugs = new Set(primaryCandidates.map((candidate) => candidate.post.slug));
	const usefulCandidates = uniqueCandidates([
		...eligibleCandidates
			.filter((candidate) => !primarySlugs.has(candidate.post.slug))
			.sort(sortForUsefulReads),
		...[...eligibleCandidates].sort(sortForUsefulReads),
	]).slice(0, 3);
	const recentCandidates = [...eligibleCandidates].sort(sortForRecentReads).slice(0, 6);
	const schemaPosts = uniqueCandidates([
		...primaryCandidates,
		...usefulCandidates,
		...recentCandidates,
	]).map((candidate) => candidate.post);

	return {
		candidates,
		primaryHighlights: toPosts(primaryCandidates),
		usefulReads: toPosts(usefulCandidates),
		recentReads: toPosts(
			recentCandidates.length >= 4
				? recentCandidates
				: [...eligibleCandidates].sort(sortForRecentReads).slice(0, 6),
		),
		schemaPosts,
	};
}
