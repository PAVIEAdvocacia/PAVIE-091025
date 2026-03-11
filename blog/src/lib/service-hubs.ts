import type { BlogPost } from './posts';
import { areaHref, areaLabel, normalizeAreaKey, normalizeTemaKey, temaHref } from './taxonomy';

interface HubTheme {
	key: string;
	label: string;
}

export interface ServiceHub {
	id: string;
	title: string;
	areaKey: string;
	summary: string;
	situations: string[];
	scopes: string[];
	themes: HubTheme[];
}

export interface HubDirectoryItem extends ServiceHub {
	postCount: number;
	areaUrl: string;
	themes: Array<HubTheme & { href: string; available: boolean }>;
}

export const SERVICE_HUBS: ServiceHub[] = [
	{
		id: 'familia-sucessoes-patrimonio',
		title: areaLabel('familia-sucessoes-patrimonio'),
		areaKey: 'familia-sucessoes-patrimonio',
		summary: 'Área de atuação para decisões familiares, sucessórias e patrimoniais que pedem clareza, documentação adequada e condução responsável.',
		situations: ['Divorcio, guarda, convivencia e alimentos.', 'Inventario, partilha, testamento e heranca.', 'Patrimonio familiar, vulnerabilidade economica e temas com elemento internacional.'],
		scopes: ['Diagnostico juridico inicial com foco em impacto familiar e patrimonial.', 'Organizacao documental e estrategia para solucao consensual ou contenciosa.', 'Acompanhamento tecnico em decisoes que exigem previsibilidade e prudencia.'],
		themes: [
			{ key: 'divorcio', label: 'Divorcio' },
			{ key: 'inventario', label: 'Inventario' },
			{ key: 'partilha', label: 'Partilha' },
		],
	},
	{
		id: 'contratos-obrigacoes-responsabilidade-civil',
		title: areaLabel('contratos-obrigacoes-responsabilidade-civil'),
		areaKey: 'contratos-obrigacoes-responsabilidade-civil',
		summary: 'Área de atuação para compromissos jurídicos, descumprimento de obrigações, cobrança e reparação de danos em relações civis.',
		situations: ['Elaboracao, revisao e negociacao contratual.', 'Inadimplemento, cobranca e execucao de obrigacoes.', 'Responsabilidade civil, prova de dano e reparacao.'],
		scopes: ['Leitura tecnica de risco e de clausulas sensiveis.', 'Estruturacao de estrategia em negociacao, cobranca ou litigio.', 'Conducao juridica com escopo claro e documentacao consistente.'],
		themes: [
			{ key: 'revisao-contratual', label: 'Revisao contratual' },
			{ key: 'inadimplemento', label: 'Inadimplemento' },
			{ key: 'responsabilidade-civil', label: 'Responsabilidade civil' },
		],
	},
	{
		id: 'imobiliario-regularizacao-condominios',
		title: areaLabel('imobiliario-regularizacao-condominios'),
		areaKey: 'imobiliario-regularizacao-condominios',
		summary: 'Área de atuação para imóveis, posse, regularização documental, locação e conflitos condominiais com impacto patrimonial.',
		situations: ['Compra e venda, locacao e clausulas criticas.', 'Regularizacao registral e documental.', 'Condominios, posse e uso do imovel.'],
		scopes: ['Analise de documentos e riscos da operacao imobiliaria.', 'Organizacao de regularizacao e estrategia registral.', 'Atuacao juridica em disputas ligadas ao uso ou propriedade do imovel.'],
		themes: [
			{ key: 'regularizacao-de-imovel', label: 'Regularizacao de imovel' },
			{ key: 'locacao', label: 'Locacao' },
			{ key: 'usucapiao', label: 'Usucapiao' },
		],
	},
	{
		id: 'consumidor-saude-previdencia',
		title: areaLabel('consumidor-saude-previdencia'),
		areaKey: 'consumidor-saude-previdencia',
		summary: 'Área de atuação para relações de consumo, cobertura de saúde e situações previdenciárias que exigem leitura aplicada.',
		situations: ['Falha de servico e cobranca indevida.', 'Negativa de cobertura e questoes ligadas a saude.', 'Beneficios, revisoes e organizacao previdenciaria.'],
		scopes: ['Enquadramento juridico da situacao e dos documentos relevantes.', 'Definicao do melhor caminho entre negociacao, requerimento e litigio.', 'Conducao objetiva de demandas com impacto pratico imediato.'],
		themes: [
			{ key: 'negativa-de-cobertura', label: 'Negativa de cobertura' },
			{ key: 'relacao-de-consumo', label: 'Relacao de consumo' },
			{ key: 'previdencia', label: 'Previdencia' },
		],
	},
	{
		id: 'compliance-integridade-atuacao-empresarial',
		title: areaLabel('compliance-integridade-atuacao-empresarial'),
		areaKey: 'compliance-integridade-atuacao-empresarial',
		summary: 'Área de atuação para governança, integridade, contratos empresariais e suporte jurídico a decisões de organização e operação.',
		situations: ['Politicas internas, conduta e rotinas de integridade.', 'Governanca societaria e apoio juridico a operacoes.', 'Contratos empresariais e prevencao de risco.'],
		scopes: ['Estruturacao de protocolos, fluxos e documentos essenciais.', 'Leitura de risco juridico e apoio a decisao empresarial.', 'Atuacao institucional em integridade, compliance e relacoes negociais.'],
		themes: [
			{ key: 'lgpd', label: 'LGPD' },
			{ key: 'codigo-de-conduta', label: 'Codigo de conduta' },
			{ key: 'governanca', label: 'Governanca' },
		],
	},
];

export function buildHubDirectory(posts: BlogPost[]): HubDirectoryItem[] {
	const areaCount = new Map<string, number>();
	const publishedThemes = new Set<string>();

	for (const post of posts) {
		const areaKey = normalizeAreaKey(post.areaKey || post.area);
		areaCount.set(areaKey, (areaCount.get(areaKey) ?? 0) + 1);
		for (const themeKey of post.temaKeys) {
			publishedThemes.add(normalizeTemaKey(themeKey));
		}
	}

	return SERVICE_HUBS.map((hub) => {
		const postCount = areaCount.get(hub.areaKey) ?? 0;
		const areaUrl = postCount > 0 ? areaHref(hub.areaKey) : '/blog/areas/';
		return {
			...hub,
			postCount,
			areaUrl,
			themes: hub.themes.map((theme) => {
				const key = normalizeTemaKey(theme.key);
				const available = publishedThemes.has(key);
				return {
					...theme,
					available,
					href: available ? temaHref(theme.key) : '/blog/temas/',
				};
			}),
		};
	});
}
