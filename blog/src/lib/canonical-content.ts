export const CANONICAL_CATEGORY_DEFINITIONS = [
	{
		code: 'CAT-01',
		slug: 'sucessoes-inventarios-partilha-patrimonial',
		label: 'Sucessões, Inventários e Partilha Patrimonial',
		displayTitle: 'Sucessões e Inventários',
		homeTitle: 'SucessÃµes e InventÃ¡rios',
		homeDescription: 'OrganizaÃ§Ã£o e conduÃ§Ã£o tÃ©cnica de inventÃ¡rios, partilhas e transmissÃ£o patrimonial.',
		homeOrder: 1,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-02',
		slug: 'planejamento-patrimonial-sucessorio-arranjos-preventivos',
		label: 'Planejamento Patrimonial, Sucessório e Arranjos Preventivos',
		displayTitle: 'Planejamento Patrimonial',
		homeTitle: 'Planejamento Patrimonial',
		homeDescription: 'EstruturaÃ§Ã£o de bens e arranjos preventivos para decisÃµes familiares e sucessÃ³rias.',
		homeOrder: 2,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-03',
		slug: 'familia-patrimonial-dissolucoes',
		label: 'Família Patrimonial e Dissoluções',
		displayTitle: 'Família Patrimonial',
		homeTitle: 'FamÃ­lia Patrimonial',
		homeDescription: 'Disputas, dissoluÃ§Ãµes e reorganizaÃ§Ãµes familiares com impacto financeiro e documental.',
		homeOrder: 3,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-04',
		slug: 'familia-binacional-sucessoes-internacionais-cooperacao-documental',
		label: 'Família Binacional, Sucessões Internacionais e Cooperação Documental',
		displayTitle: 'Família Binacional',
		homeTitle: 'FamÃ­lia Binacional',
		homeDescription: 'QuestÃµes familiares e sucessÃ³rias com elementos internacionais, documentos e jurisdiÃ§Ãµes.',
		homeOrder: 6,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-05',
		slug: 'imoveis-registro-regularizacoes-litigios-patrimoniais',
		label: 'Imóveis, Registro, Regularizações e Litígios Patrimoniais',
		displayTitle: 'Imóveis e Regularizações',
		homeTitle: 'ImÃ³veis e RegularizaÃ§Ãµes',
		homeDescription: 'AnÃ¡lise documental, registro, regularizaÃ§Ã£o e proteÃ§Ã£o patrimonial envolvendo imÃ³veis.',
		homeOrder: 5,
		runtimeAreaKey: 'imobiliario-regularizacao-condominios',
	},
	{
		code: 'CAT-06',
		slug: 'cobranca-execucao-contratos-recuperacao-credito-seletiva',
		label: 'Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva',
		displayTitle: 'Cobrança e Contratos',
		homeTitle: 'CobranÃ§a e Contratos',
		homeDescription: 'EstratÃ©gia de cobranÃ§a, execuÃ§Ã£o, contratos e recuperaÃ§Ã£o seletiva de crÃ©ditos.',
		homeOrder: 7,
		runtimeAreaKey: 'contratos-obrigacoes-responsabilidade-civil',
	},
	{
		code: 'CAT-07',
		slug: 'tributacao-patrimonial-recuperacao-tributaria-seletiva',
		label: 'Tributação Patrimonial e Recuperação Tributária Seletiva',
		displayTitle: 'Tributação Patrimonial',
		// Compatibilidade temporária com o runtime atual de 5 áreas.
		homeTitle: 'TributaÃ§Ã£o Patrimonial',
		homeDescription: 'AnÃ¡lise de impactos fiscais, regularizaÃ§Ã£o e recuperaÃ§Ã£o tributÃ¡ria seletiva.',
		homeOrder: 8,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-08',
		slug: 'direito-do-consumidor-responsabilidade-civil',
		label: 'Direito do Consumidor e Responsabilidade Civil',
		displayTitle: 'Consumidor e Responsabilidade Civil',
		homeTitle: 'Consumidor e Responsabilidade Civil',
		homeDescription: 'Passagens aÃ©reas, cobranÃ§as indevidas e negativaÃ§Ã£o indevida com base em documentos.',
		homeOrder: 4,
		runtimeAreaKey: 'consumidor-saude-previdencia',
	},
] as const;

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
		role: 'Sócio-fundador da PAVIE | Advocacia',
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
	return definition ? `/blog/categoria/${definition.slug}/` : '/blog/categoria/';
}

export function canonicalAreaHref(codeOrSlug: string): string {
	const definition = getCanonicalCategoryDefinition(codeOrSlug);
	const slug = definition?.slug ?? codeOrSlug;
	return `/areas/${slug.replace(/^\/+|\/+$/g, '')}/`;
}

export function canonicalAuthorHref(slug: string): string {
	return `/autor/${slug.replace(/^\/+|\/+$/g, '')}/`;
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
