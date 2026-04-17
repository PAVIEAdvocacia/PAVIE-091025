import {
	areaRoute,
	categoryRoute,
	CATEGORY_REGISTRY,
	type CategoryCode,
	type CategoryRegistryItem,
} from './categories.registry';

export interface AreaRegistryItem {
	categoryCode: CategoryCode;
	slug: string;
	canonicalTitle: CategoryRegistryItem['canonicalTitle'];
	displayTitle: CategoryRegistryItem['displayTitle'];
	areaHref: string;
	categoryHref: string;
}

export const AREA_REGISTRY = CATEGORY_REGISTRY.map((category) => ({
	categoryCode: category.code,
	slug: category.areaSlug,
	canonicalTitle: category.canonicalTitle,
	displayTitle: category.displayTitle,
	areaHref: areaRoute(category),
	categoryHref: categoryRoute(category),
})) satisfies AreaRegistryItem[];

export const AREA_REGISTRY_BY_CATEGORY_CODE = Object.fromEntries(
	AREA_REGISTRY.map((area) => [area.categoryCode, area]),
) as Record<CategoryCode, AreaRegistryItem>;

export const AREA_REGISTRY_BY_SLUG = Object.fromEntries(
	AREA_REGISTRY.map((area) => [area.slug, area]),
) as Record<string, AreaRegistryItem>;

export function getAreaByCategoryCode(code: string): AreaRegistryItem | undefined {
	return AREA_REGISTRY_BY_CATEGORY_CODE[code as CategoryCode];
}

export function getAreaBySlug(slug: string): AreaRegistryItem | undefined {
	return AREA_REGISTRY_BY_SLUG[slug.replace(/^\/+|\/+$/g, '')];
}
