export const EDITORIAL_AREAS = [
	{
		key: 'familia-sucessoes-patrimonio',
		label: 'Familia, Sucessoes e Patrimonio',
		aliases: [
			'familia',
			'sucessoes',
			'internacional',
			'planejamento-sucessorio',
			'sucessoes-e-patrimonio',
			'familia-e-patrimonio',
			'direito-e-patrimonio',
		],
	},
	{
		key: 'contratos-obrigacoes-responsabilidade-civil',
		label: 'Contratos, Obrigacoes e Responsabilidade Civil',
		aliases: ['contratos', 'cobranca', 'contratos-e-negocios', 'cobranca-e-recuperacao-de-credito'],
	},
	{
		key: 'imobiliario-regularizacao-condominios',
		label: 'Imobiliario, Regularizacao e Condominios',
		aliases: ['imobiliario', 'direito-imobiliario', 'imobiliario-e-regularizacao'],
	},
	{
		key: 'consumidor-saude-previdencia',
		label: 'Consumidor, Saude e Previdencia',
		aliases: ['consumidor', 'consumidor-e-responsabilidade'],
	},
	{
		key: 'compliance-integridade-atuacao-empresarial',
		label: 'Compliance, Integridade e Atuacao Empresarial',
		aliases: [
			'compliance',
			'empresarial',
			'compliance-e-integridade',
			'empresarial-e-societario',
		],
	},
] as const;

export const EDITORIAL_AREA_KEYS = EDITORIAL_AREAS.map((area) => area.key) as string[];
export const EDITORIAL_AREA_LABELS = EDITORIAL_AREAS.map((area) => area.label) as string[];

export const EDITORIAL_STATUSES = ['draft', 'published', 'archived'] as const;

export const EDITORIAL_FUNNEL_STAGES = [
	'descoberta',
	'consideracao',
	'aprofundamento',
	'orientacao',
	'contato',
] as const;

export const EDITORIAL_AUTHORS = ['Fabio Mathias Pavie'] as const;

export const PRIMARY_CTA_OPTIONS = [
	{
		key: 'areas_editoriais',
		label: 'Explorar temas',
		href: '/blog/areas/',
		description: 'Continue a leitura pela área jurídica correspondente e encontre novos caminhos de aprofundamento.',
	},
	{
		key: 'diagnostico_juridico',
		label: 'Solicitar orientação inicial',
		href: '/blog/contato/',
		description: 'Entenda quando faz sentido avançar para a triagem inicial e quais informações ajudam no primeiro contato.',
	},
	{
		key: 'areas_de_atuacao',
		label: 'Conheça os Serviços',
		href: '/areas/',
		description: 'Veja as áreas de atuação da PAVIE relacionadas a esta leitura.',
	},
] as const;

export const PRIMARY_CTA_KEYS = PRIMARY_CTA_OPTIONS.map((option) => option.key) as string[];
