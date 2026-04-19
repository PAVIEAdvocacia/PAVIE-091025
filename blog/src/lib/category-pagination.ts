import type { BlogPost } from './posts';

export const CATEGORY_PAGE_SIZE = 9;

function normalizePageSize(pageSize: number): number {
	return Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : CATEGORY_PAGE_SIZE;
}

function getPaginatedPosts(posts: BlogPost[], featuredPost?: BlogPost): BlogPost[] {
	if (!featuredPost) return posts;
	return posts.filter((post) => post.slug !== featuredPost.slug);
}

export function getCategoryPageCount(
	posts: BlogPost[],
	featuredPost?: BlogPost,
	pageSize = CATEGORY_PAGE_SIZE,
): number {
	const safePageSize = normalizePageSize(pageSize);
	const remainingPosts = getPaginatedPosts(posts, featuredPost);
	const firstPageCapacity = featuredPost ? safePageSize - 1 : safePageSize;

	if (remainingPosts.length <= firstPageCapacity) {
		return 1;
	}

	return 1 + Math.ceil((remainingPosts.length - firstPageCapacity) / safePageSize);
}

export function getCategoryPageState(
	posts: BlogPost[],
	featuredPost: BlogPost | undefined,
	pageNumber: number,
	pageSize = CATEGORY_PAGE_SIZE,
) {
	const safePageSize = normalizePageSize(pageSize);
	const safePageNumber = Number.isFinite(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;
	const remainingPosts = getPaginatedPosts(posts, featuredPost);
	const firstPageCapacity = featuredPost ? safePageSize - 1 : safePageSize;
	const pageCount = getCategoryPageCount(posts, featuredPost, safePageSize);
	const start = safePageNumber === 1
		? 0
		: firstPageCapacity + (safePageNumber - 2) * safePageSize;
	const limit = safePageNumber === 1 ? firstPageCapacity : safePageSize;

	return {
		pageSize: safePageSize,
		pageNumber: safePageNumber,
		pageCount,
		listPosts: remainingPosts.slice(start, start + limit),
		firstItemNumber: (featuredPost ? 1 : 0) + start + 1,
		hasPagination: pageCount > 1,
	};
}
