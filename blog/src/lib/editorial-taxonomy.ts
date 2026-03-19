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

export const PRIMARY_CTA_OPTIONS = [
	{
		key: 'areas_editoriais',
		label: 'Explorar categorias',
		href: '/blog/categoria/',
		description: 'Continue a leitura por assunto e encontre novos caminhos para aprofundar a situacao.',
	},
	{
		key: 'diagnostico_juridico',
		label: 'Solicitar orientacao inicial',
		href: '/blog/contato/',
		description:
			'Entenda quando faz sentido avancar para a orientacao inicial e quais informacoes ajudam no primeiro contato.',
	},
	{
		key: 'areas_de_atuacao',
		label: 'Conheca os Servicos',
		href: '/areas/',
		description: 'Veja como a PAVIE apresenta esta area de atuacao na camada institucional do site.',
	},
] as const;
