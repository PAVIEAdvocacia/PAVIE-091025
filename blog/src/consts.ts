function normalizeOrigin(value: string | undefined, fallback: string): string {
	const raw = value?.trim() || fallback;
	return raw.replace(/\/+$/, '');
}

export const SITE_ORIGIN = normalizeOrigin(
	import.meta.env.PUBLIC_SITE_ORIGIN,
	'https://blog.pavieadvocacia.com.br',
);

export const MAIN_SITE_URL = normalizeOrigin(
	import.meta.env.PUBLIC_MAIN_SITE_URL,
	SITE_ORIGIN,
);

export const BLOG_SITE_URL = normalizeOrigin(
	import.meta.env.PUBLIC_BLOG_SITE_URL,
	SITE_ORIGIN,
);

export const SITE_TITLE = 'PAVIE | Advocacia — Blog Jurídico';
export const SITE_DESCRIPTION =
	'Conteúdos jurídicos da PAVIE | Advocacia para reconhecer situações, navegar por assunto e buscar orientação com contexto.';

export const BUSINESS_NAME = 'PAVIE | Advocacia';
export const BUSINESS_EMAIL = 'contato@pavieadvocacia.com.br';
export const BUSINESS_PHONE_E164 = '+5521964382263';
export const BUSINESS_PHONE_DISPLAY = '+55 (21) 96438-2263';
export const BUSINESS_ADDRESS = {
	streetAddress: 'Av. Ataulfo de Paiva, 1235',
	addressLocality: 'Rio de Janeiro',
	addressRegion: 'RJ',
	addressCountry: 'BR',
} as const;

export const DEFAULT_AUTHOR_NAME = 'Fabio Mathias Pavie';
export const DEFAULT_AUTHOR_ROLE = 'Sócio-fundador da PAVIE | Advocacia';

export const DEFAULT_OG_IMAGE = '/uploads/001-convertido-de-png.webp';

export const DEFAULT_CTA = {
	label: 'Solicitar orientação inicial',
	href: '/#contato',
	description: 'Descreva sua situação para entender quando faz sentido avançar para a orientação inicial.',
};
