export const EDITORIAL_AREAS = [
	{
		key: 'familia-sucessoes-patrimonio',
		label: 'Família, Sucessões e Patrimônio',
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
		label: 'Contratos, Obrigações e Responsabilidade Civil',
		aliases: ['contratos', 'cobranca', 'contratos-e-negocios', 'cobranca-e-recuperacao-de-credito'],
	},
	{
		key: 'imobiliario-regularizacao-condominios',
		label: 'Imobiliário, Regularização e Condomínios',
		aliases: ['imobiliario', 'direito-imobiliario', 'imobiliario-e-regularizacao'],
	},
	{
		key: 'consumidor-saude-previdencia',
		label: 'Consumidor e Responsabilidade Civil',
		aliases: ['consumidor', 'direito-do-consumidor', 'responsabilidade-civil', 'consumidor-e-responsabilidade'],
	},
	{
		key: 'compliance-integridade-atuacao-empresarial',
		label: 'Compliance, Integridade e Atuação Empresarial',
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
		href: '/blog/',
		description: 'Continue a leitura por assunto e encontre novos caminhos para aprofundar a situação.',
	},
	{
		key: 'diagnostico_juridico',
		label: 'Solicitar orientação inicial',
		href: '/#contato',
		description:
			'Entenda quando faz sentido avançar para a orientação inicial e quais informações ajudam no primeiro contato.',
	},
	{
		key: 'areas_de_atuacao',
		label: 'Conheça as áreas',
		href: '/#areas',
		description: 'Veja como a PAVIE apresenta suas áreas de atuação na camada institucional do site.',
	},
] as const;
