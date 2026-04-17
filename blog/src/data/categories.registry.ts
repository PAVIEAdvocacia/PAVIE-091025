export const CATEGORY_REGISTRY = [
	{
		code: 'CAT-01',
		canonicalTitle: 'Sucessões, Inventários e Partilha Patrimonial',
		displayTitle: 'Sucessões e Inventários',
		homeTitle: 'Sucessões e Inventários',
		homeDescription:
			'Inventários, partilhas e transmissão patrimonial tratados com organização documental e leitura técnica.',
		categorySlug: 'sucessoes-inventarios-partilha-patrimonial',
		areaSlug: 'sucessoes-inventarios-partilha-patrimonial',
		homeOrder: 1,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-02',
		canonicalTitle: 'Planejamento Patrimonial, Sucessório e Arranjos Preventivos',
		displayTitle: 'Planejamento Patrimonial',
		homeTitle: 'Planejamento Patrimonial',
		homeDescription:
			'Arranjos preventivos, estrutura patrimonial e decisões sucessórias com proporcionalidade.',
		categorySlug: 'planejamento-patrimonial-sucessorio-arranjos-preventivos',
		areaSlug: 'planejamento-patrimonial-sucessorio-arranjos-preventivos',
		homeOrder: 2,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-03',
		canonicalTitle: 'Família Patrimonial e Dissoluções',
		displayTitle: 'Família Patrimonial',
		homeTitle: 'Família Patrimonial',
		homeDescription:
			'Vínculos familiares, dissoluções e efeitos patrimoniais analisados com prova e contexto.',
		categorySlug: 'familia-patrimonial-dissolucoes',
		areaSlug: 'familia-patrimonial-dissolucoes',
		homeOrder: 3,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-04',
		canonicalTitle: 'Família Binacional, Sucessões Internacionais e Cooperação Documental',
		displayTitle: 'Família Binacional',
		homeTitle: 'Família Binacional',
		homeDescription:
			'Questões familiares, sucessórias e documentais com elementos internacionais seletivos.',
		categorySlug: 'familia-binacional-sucessoes-internacionais-cooperacao-documental',
		areaSlug: 'familia-binacional-sucessoes-internacionais-cooperacao-documental',
		homeOrder: 6,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-05',
		canonicalTitle: 'Imóveis, Registro, Regularizações e Litígios Patrimoniais',
		displayTitle: 'Imóveis e Regularizações',
		homeTitle: 'Imóveis e Regularizações',
		homeDescription:
			'Registro, regularização, cadeia documental e conflitos patrimoniais envolvendo imóveis.',
		categorySlug: 'imoveis-registro-regularizacoes-litigios-patrimoniais',
		areaSlug: 'imoveis-registro-regularizacoes-litigios-patrimoniais',
		homeOrder: 5,
		runtimeAreaKey: 'imobiliario-regularizacao-condominios',
	},
	{
		code: 'CAT-06',
		canonicalTitle: 'Cobrança, Execução, Contratos e Recuperação de Crédito Seletiva',
		displayTitle: 'Cobrança e Contratos',
		homeTitle: 'Cobrança e Contratos',
		homeDescription:
			'Cobrança, execução e contratos selecionados quando a documentação exige estratégia.',
		categorySlug: 'cobranca-execucao-contratos-recuperacao-credito-seletiva',
		areaSlug: 'cobranca-execucao-contratos-recuperacao-credito-seletiva',
		homeOrder: 7,
		runtimeAreaKey: 'contratos-obrigacoes-responsabilidade-civil',
	},
	{
		code: 'CAT-07',
		canonicalTitle: 'Tributação Patrimonial e Recuperação Tributária Seletiva',
		displayTitle: 'Tributação Patrimonial',
		homeTitle: 'Tributação Patrimonial',
		homeDescription:
			'Reflexos fiscais patrimoniais e recuperação tributária seletiva com aderência material.',
		categorySlug: 'tributacao-patrimonial-recuperacao-tributaria-seletiva',
		areaSlug: 'tributacao-patrimonial-recuperacao-tributaria-seletiva',
		homeOrder: 8,
		runtimeAreaKey: 'familia-sucessoes-patrimonio',
	},
	{
		code: 'CAT-08',
		canonicalTitle: 'Direito do Consumidor e Responsabilidade Civil',
		displayTitle: 'Consumidor e Responsabilidade Civil',
		homeTitle: 'Consumidor e Responsabilidade Civil',
		homeDescription:
			'Passagens aéreas, cobranças indevidas, negativação e falhas documentáveis de serviço.',
		categorySlug: 'direito-do-consumidor-responsabilidade-civil',
		areaSlug: 'direito-do-consumidor-responsabilidade-civil',
		homeOrder: 4,
		runtimeAreaKey: 'consumidor-saude-previdencia',
	},
] as const;

export type CategoryRegistryItem = (typeof CATEGORY_REGISTRY)[number];
export type CategoryCode = CategoryRegistryItem['code'];

export const CATEGORY_CODES = CATEGORY_REGISTRY.map((category) => category.code) as [
	CategoryCode,
	...CategoryCode[],
];

export const CATEGORY_REGISTRY_BY_CODE = Object.fromEntries(
	CATEGORY_REGISTRY.map((category) => [category.code, category]),
) as Record<CategoryCode, CategoryRegistryItem>;

export const CATEGORY_REGISTRY_BY_SLUG = Object.fromEntries(
	CATEGORY_REGISTRY.flatMap((category) => [
		[category.categorySlug, category],
		[category.areaSlug, category],
	]),
) as Record<string, CategoryRegistryItem>;

export function getCategoryByCode(code: string): CategoryRegistryItem | undefined {
	return CATEGORY_REGISTRY_BY_CODE[code as CategoryCode];
}

export function getCategoryBySlug(slug: string): CategoryRegistryItem | undefined {
	return CATEGORY_REGISTRY_BY_SLUG[slug.replace(/^\/+|\/+$/g, '')];
}

export function categoryRoute(category: CategoryRegistryItem): string {
	return `/blog/categoria/${category.categorySlug}/`;
}

export function areaRoute(category: CategoryRegistryItem): string {
	return `/areas/${category.areaSlug}/`;
}
