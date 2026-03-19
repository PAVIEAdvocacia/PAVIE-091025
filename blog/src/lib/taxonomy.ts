import { EDITORIAL_AREAS } from './editorial-taxonomy';

const AREA_CANONICAL_LABELS = Object.fromEntries(
	EDITORIAL_AREAS.map((area) => [area.key, area.label]),
) as Record<string, string>;

const AREA_ALIASES = Object.fromEntries(
	EDITORIAL_AREAS.flatMap((area) => [area.key, area.label, ...area.aliases].map((alias) => [normalizeTaxonomyValue(alias), area.key])),
) as Record<string, string>;

function titleize(value: string): string {
	return value
		.replace(/[_-]+/g, ' ')
		.trim()
		.split(/\s+/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function normalizeAreaKey(value: string): string {
	const key = normalizeTaxonomyValue(value);
	return AREA_ALIASES[key] ?? key;
}

export function areaLabel(value: string): string {
	const key = normalizeAreaKey(value);
	return AREA_CANONICAL_LABELS[key] ?? titleize(value);
}

export function normalizeTemaKey(value: string): string {
	return normalizeTaxonomyValue(value).replace(/\s+/g, '-');
}

function normalizeTaxonomyValue(value: string): string {
	return value
		.trim()
		.replace(/^\/+|\/+$/g, '')
		.replace(/\\/g, '/')
		.split('/')
		.filter(Boolean)
		.join('/')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9/]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/\/-/g, '/')
		.replace(/-\/+/g, '/')
		.replace(/^[-/]+|[-/]+$/g, '');
}
