import {
	BUSINESS_ADDRESS,
	BUSINESS_EMAIL,
	BUSINESS_NAME,
	BUSINESS_PHONE_E164,
	MAIN_SITE_URL,
} from '../consts';

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface FaqSchemaItem {
	question: string;
	answer: string;
}

export function toAbsoluteUrl(href?: string, fallback = MAIN_SITE_URL): string {
	if (!href) return fallback;
	if (/^https?:\/\//i.test(href)) return href;
	return new URL(href, MAIN_SITE_URL).toString();
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[], currentUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			item: toAbsoluteUrl(item.href ?? currentUrl),
		})),
	};
}

export function buildFaqSchema(items: FaqSchemaItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	};
}

export const PUBLISHER_SCHEMA = {
	'@type': 'Organization',
	name: BUSINESS_NAME,
	url: MAIN_SITE_URL,
};

export const LEGAL_SERVICE_BASE_SCHEMA = {
	'@context': 'https://schema.org',
	'@type': ['LegalService', 'LocalBusiness'],
	'@id': `${MAIN_SITE_URL}/#pavie-advocacia`,
	name: BUSINESS_NAME,
	url: `${MAIN_SITE_URL}/`,
	email: BUSINESS_EMAIL,
	telephone: BUSINESS_PHONE_E164,
	address: {
		'@type': 'PostalAddress',
		...BUSINESS_ADDRESS,
	},
	areaServed: {
		'@type': 'Country',
		name: 'Brasil',
	},
};
