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
		situations: ['Divórcio, guarda, convivência e alimentos.', 'Inventário, partilha, testamento e herança.', 'Patrimônio familiar, vulnerabilidade econômica e temas com elemento internacional.'],
		scopes: ['Diagnóstico jurídico inicial com foco em impacto familiar e patrimonial.', 'Organização documental e estratégia para solução consensual ou contenciosa.', 'Acompanhamento técnico em decisões que exigem previsibilidade e prudência.'],
		themes: [
			{ key: 'divorcio', label: 'Divórcio' },
			{ key: 'inventario', label: 'Inventário' },
			{ key: 'partilha', label: 'Partilha' },
		],
	},
	{
		id: 'contratos-obrigacoes-responsabilidade-civil',
		title: areaLabel('contratos-obrigacoes-responsabilidade-civil'),
		areaKey: 'contratos-obrigacoes-responsabilidade-civil',
		summary: 'Área de atuação para compromissos jurídicos, descumprimento de obrigações, cobrança e reparação de danos em relações civis.',
		situations: ['Elaboração, revisão e negociação contratual.', 'Inadimplemento, cobrança e execução de obrigações.', 'Responsabilidade civil, prova de dano e reparação.'],
		scopes: ['Leitura técnica de risco e de cláusulas sensíveis.', 'Estruturação de estratégia em negociação, cobrança ou litígio.', 'Condução jurídica com escopo claro e documentação consistente.'],
		themes: [
			{ key: 'revisao-contratual', label: 'Revisão contratual' },
			{ key: 'inadimplemento', label: 'Inadimplemento' },
			{ key: 'responsabilidade-civil', label: 'Responsabilidade civil' },
		],
	},
	{
		id: 'imobiliario-regularizacao-condominios',
		title: areaLabel('imobiliario-regularizacao-condominios'),
		areaKey: 'imobiliario-regularizacao-condominios',
		summary: 'Área de atuação para imóveis, posse, regularização documental, locação e conflitos condominiais com impacto patrimonial.',
		situations: ['Compra e venda, locação e cláusulas críticas.', 'Regularização registral e documental.', 'Condomínios, posse e uso do imóvel.'],
		scopes: ['Análise de documentos e riscos da operação imobiliária.', 'Organização de regularização e estratégia registral.', 'Atuação jurídica em disputas ligadas ao uso ou propriedade do imóvel.'],
		themes: [
			{ key: 'regularizacao-de-imovel', label: 'Regularização de imóvel' },
			{ key: 'locacao', label: 'Locação' },
			{ key: 'usucapiao', label: 'Usucapião' },
		],
	},
	{
		id: 'consumidor-saude-previdencia',
		title: areaLabel('consumidor-saude-previdencia'),
		areaKey: 'consumidor-saude-previdencia',
		summary: 'Área de atuação para relações de consumo, cobertura de saúde e situações previdenciárias que exigem leitura aplicada.',
		situations: ['Falha de serviço e cobrança indevida.', 'Negativa de cobertura e questões ligadas à saúde.', 'Benefícios, revisões e organização previdenciária.'],
		scopes: ['Enquadramento jurídico da situação e dos documentos relevantes.', 'Definição do melhor caminho entre negociação, requerimento e litígio.', 'Condução objetiva de demandas com impacto prático imediato.'],
		themes: [
			{ key: 'negativa-de-cobertura', label: 'Negativa de cobertura' },
			{ key: 'relacao-de-consumo', label: 'Relação de consumo' },
			{ key: 'previdencia', label: 'Previdência' },
		],
	},
	{
		id: 'compliance-integridade-atuacao-empresarial',
		title: areaLabel('compliance-integridade-atuacao-empresarial'),
		areaKey: 'compliance-integridade-atuacao-empresarial',
		summary: 'Área de atuação para governança, integridade, contratos empresariais e suporte jurídico a decisões de organização e operação.',
		situations: ['Políticas internas, conduta e rotinas de integridade.', 'Governança societária e apoio jurídico a operações.', 'Contratos empresariais e prevenção de risco.'],
		scopes: ['Estruturação de protocolos, fluxos e documentos essenciais.', 'Leitura de risco jurídico e apoio à decisão empresarial.', 'Atuação institucional em integridade, compliance e relações negociais.'],
		themes: [
			{ key: 'lgpd', label: 'LGPD' },
			{ key: 'codigo-de-conduta', label: 'Código de conduta' },
			{ key: 'governanca', label: 'Governança' },
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
