import { CATEGORY_REGISTRY } from '../data/categories.registry';

export const CANONICAL_CATEGORY_DEFINITIONS = CATEGORY_REGISTRY.map((category) => ({
	code: category.code,
	slug: category.categorySlug,
	label: category.canonicalTitle,
	displayTitle: category.displayTitle,
	homeTitle: category.homeTitle,
	homeDescription: category.homeDescription,
	homeOrder: category.homeOrder,
	runtimeAreaKey: category.runtimeAreaKey,
}));

export const CANONICAL_CATEGORY_CODES = CANONICAL_CATEGORY_DEFINITIONS.map(
	(category) => category.code,
) as [string, ...string[]];

export const CONTENT_TYPE_OPTIONS = [
	'cornerstone',
	'guide',
	'spoke',
	'faq',
	'checklist',
	'case-note',
	'institutional',
] as const;

export const READER_STAGE_OPTIONS = [
	'discover',
	'clarify',
	'compare',
	'decide',
] as const;

export const CTA_TYPE_OPTIONS = [
	'area',
	'contact',
	'article-series',
	'document-review',
] as const;

export const REVIEW_STATUS_OPTIONS = [
	'pending',
	'reviewed',
	'needs-adjustment',
] as const;

export const MIGRATION_STATUS_OPTIONS = [
	'native',
	'migrated',
	'revised',
	'archived',
	'redirected',
] as const;

export const AUTHOR_DEFINITIONS = [
	{
		id: 'fabio-pavie',
		name: 'Fabio Mathias Pavie',
		slug: 'fabio-pavie',
		role: 'Advogado titular e fundador da PAVIE | Advocacia, OAB/RJ 134.947',
		image: '/uploads/fabio-pavie-profile.png',
		imageAlt: 'Foto profissional do advogado Fabio Mathias Pavie',
	},
] as const;

export const AUTHOR_IDS = AUTHOR_DEFINITIONS.map((author) => author.id) as [string, ...string[]];

export const LEGACY_PUBLICATION_STATUS_OPTIONS = [
	'draft',
	'published',
	'archived',
] as const;

export const LEGACY_FUNNEL_STAGE_OPTIONS = [
	'descoberta',
	'consideracao',
	'aprofundamento',
	'orientacao',
	'contato',
] as const;

export const LEGACY_PRIMARY_CTA_OPTIONS = [
	'areas_editoriais',
	'diagnostico_juridico',
	'areas_de_atuacao',
] as const;

export const LEGACY_TO_CANONICAL_AREA_MATRIX = [
	{
		legacyAreaKey: 'familia-sucessoes-patrimonio',
		legacyAreaLabel: 'Família, Sucessões e Patrimônio',
		targetCategoryCodes: ['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04'] as const,
		migrationRule:
			'Desdobrar por materialidade: sucessões/inventários, planejamento, dissoluções familiares ou internacional/documental.',
	},
	{
		legacyAreaKey: 'contratos-obrigacoes-responsabilidade-civil',
		legacyAreaLabel: 'Contratos, Obrigações e Responsabilidade Civil',
		targetCategoryCodes: ['CAT-06'] as const,
		migrationRule:
			'Migrar para cobrança, execução, contratos e recuperação de crédito seletiva quando houver aderência ao foco institucional.',
	},
	{
		legacyAreaKey: 'imobiliario-regularizacao-condominios',
		legacyAreaLabel: 'Imobiliário, Regularização e Condomínios',
		targetCategoryCodes: ['CAT-05'] as const,
		migrationRule:
			'Migrar para imóveis, registro, regularizações e litígios patrimoniais.',
	},
	{
		legacyAreaKey: 'consumidor-saude-previdencia',
		legacyAreaLabel: 'Consumidor e Responsabilidade Civil',
		targetCategoryCodes: ['CAT-08'] as const,
		migrationRule:
			'Migrar para direito do consumidor e responsabilidade civil quando houver aderência a falhas de serviço, negativação, cobrança abusiva ou dano indenizável com base documental mínima.',
	},
	{
		legacyAreaKey: 'compliance-integridade-atuacao-empresarial',
		legacyAreaLabel: 'Compliance, Integridade e Atuação Empresarial',
		targetCategoryCodes: [] as const,
		migrationRule:
			'Sem correspondência canônica direta no modelo vigente de 8 categorias. Exige triagem manual, reclassificação extraordinária ou arquivamento.',
	},
] as const;

export const LEGACY_AREAS_WITHOUT_APPROVED_CANONICAL_CORRESPONDENCE =
	LEGACY_TO_CANONICAL_AREA_MATRIX.filter((item) => item.targetCategoryCodes.length === 0).map(
		(item) => item.legacyAreaKey,
	) as string[];

export const LEGACY_AREA_ROUTE_ALIASES: Record<string, string> = {
	'familia-sucessoes-patrimonio': 'familia-sucessoes-patrimonio',
	familia: 'familia-sucessoes-patrimonio',
	sucessoes: 'familia-sucessoes-patrimonio',
	internacional: 'familia-sucessoes-patrimonio',
	'contratos-obrigacoes-responsabilidade-civil': 'contratos-obrigacoes-responsabilidade-civil',
	contratos: 'contratos-obrigacoes-responsabilidade-civil',
	cobranca: 'contratos-obrigacoes-responsabilidade-civil',
	'imobiliario-regularizacao-condominios': 'imobiliario-regularizacao-condominios',
	imobiliario: 'imobiliario-regularizacao-condominios',
	'consumidor-saude-previdencia': 'consumidor-saude-previdencia',
	consumidor: 'consumidor-saude-previdencia',
	'compliance-integridade-atuacao-empresarial': 'compliance-integridade-atuacao-empresarial',
	compliance: 'compliance-integridade-atuacao-empresarial',
	empresarial: 'compliance-integridade-atuacao-empresarial',
};

const CANONICAL_CATEGORY_BY_CODE = Object.fromEntries(
	CANONICAL_CATEGORY_DEFINITIONS.map((category) => [category.code, category]),
) as Record<string, (typeof CANONICAL_CATEGORY_DEFINITIONS)[number]>;

const LEGACY_AREA_MATRIX_BY_KEY = Object.fromEntries(
	LEGACY_TO_CANONICAL_AREA_MATRIX.map((item) => [item.legacyAreaKey, item]),
) as Record<string, (typeof LEGACY_TO_CANONICAL_AREA_MATRIX)[number]>;

const AUTHOR_BY_ID = Object.fromEntries(
	AUTHOR_DEFINITIONS.map((author) => [author.id, author]),
) as Record<string, (typeof AUTHOR_DEFINITIONS)[number]>;

export function getCanonicalCategoryDefinition(code: string) {
	return CANONICAL_CATEGORY_BY_CODE[code];
}

export function resolveApprovedCategoryCodeFromLegacyArea(
	legacyAreaKey: string,
): string | undefined {
	const targets = getLegacyAreaMigrationDefinition(legacyAreaKey)?.targetCategoryCodes ?? [];
	return targets.length === 1 ? targets[0] : undefined;
}

export function resolveRuntimeAreaKeyFromCategoryCode(
	code: string,
): string | undefined {
	return getCanonicalCategoryDefinition(code)?.runtimeAreaKey;
}

export function canonicalCategoryHref(code: string): string {
	const definition = getCanonicalCategoryDefinition(code);
	return definition ? `/blog/categoria/${definition.slug}/` : '/blog/';
}

export function canonicalAreaHref(codeOrSlug: string): string {
	const definition = getCanonicalCategoryDefinition(codeOrSlug);
	const slug = definition?.slug ?? codeOrSlug;
	return `/areas/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function canonicalAuthorHref(slug: string): string {
	return `/blog/autor/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function getAuthorDefinitionById(id: string) {
	return AUTHOR_BY_ID[id];
}

export function getLegacyAreaMigrationDefinition(key: string) {
	return LEGACY_AREA_MATRIX_BY_KEY[key];
}

export function hasApprovedCanonicalCorrespondenceForLegacyArea(key: string): boolean {
	return (getLegacyAreaMigrationDefinition(key)?.targetCategoryCodes.length ?? 0) > 0;
}

function normalizeLegacyAreaRouteValue(value: string): string {
	return value
		.trim()
		.replace(/^\/+|\/+$/g, '')
		.replace(/\\/g, '/')
		.split('/')
		.filter(Boolean)
		.join('/')
		.replace(/[_\s]+/g, '-')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

export function resolveLegacyAreaRouteKey(value: string): string {
	const normalized = normalizeLegacyAreaRouteValue(value);
	return LEGACY_AREA_ROUTE_ALIASES[normalized] ?? normalized;
}

export function getLegacyAreaRouteStaticKeys(): string[] {
	return [...new Set(Object.keys(LEGACY_AREA_ROUTE_ALIASES))];
}

export function resolveLegacyFunnelStage(readerStage: string): string {
	switch (readerStage) {
		case 'discover':
			return 'descoberta';
		case 'clarify':
			return 'consideracao';
		case 'compare':
			return 'aprofundamento';
		case 'decide':
			return 'orientacao';
		default:
			return 'consideracao';
	}
}
