import type { BlogPost } from './posts';
import { areaHref, normalizeAreaKey, normalizeTemaKey, temaHref } from './taxonomy';

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
		id: 'familia-patrimonio',
		title: 'Familia e Patrimonio',
		areaKey: 'familia',
		summary: 'Organizacao juridica para conflitos familiares, guarda, alimentos e estrutura patrimonial.',
		situations: ['divorcio com bens', 'guarda e convivencia', 'uniao estavel e partilha'],
		scopes: ['orientacao inicial e estrategia', 'acordos e mediacao familiar', 'atuacao contenciosa quando necessaria'],
		themes: [
			{ key: 'divorcio', label: 'Divorcio' },
			{ key: 'guarda', label: 'Guarda' },
			{ key: 'alimentos', label: 'Alimentos' },
		],
	},
	{
		id: 'sucessoes-inventario',
		title: 'Sucessoes e Inventario',
		areaKey: 'sucessoes',
		summary: 'Planejamento sucessorio, inventario e partilha com foco em seguranca documental e previsibilidade.',
		situations: ['inventario judicial ou extrajudicial', 'partilha de bens', 'heranca com risco de conflito'],
		scopes: ['mapa documental do espolio', 'cronograma de etapas', 'regularizacao fiscal e registral'],
		themes: [
			{ key: 'inventario', label: 'Inventario' },
			{ key: 'partilha', label: 'Partilha' },
			{ key: 'itcmd', label: 'ITCMD' },
		],
	},
	{
		id: 'imobiliario-regularizacao',
		title: 'Imobiliario e Regularizacao',
		areaKey: 'imobiliario',
		summary: 'Transacoes e regularizacoes com analise de risco, documentos corretos e clausulas consistentes.',
		situations: ['compra e venda com risco', 'regularizacao de matricula', 'conflitos de locacao'],
		scopes: ['due diligence documental', 'estrutura contratual segura', 'atuacao em disputas imobiliarias'],
		themes: [
			{ key: 'regularizacao-imovel', label: 'Regularizacao de Imovel' },
			{ key: 'usucapiao', label: 'Usucapiao' },
			{ key: 'locacao', label: 'Locacao' },
		],
	},
	{
		id: 'familia-internacional',
		title: 'Familia e Patrimonio Internacional',
		areaKey: 'internacional',
		summary: 'Demandas com elemento estrangeiro, documentos transnacionais e coordenacao juridica entre jurisdicoes.',
		situations: ['familia binacional', 'bens no exterior', 'documentacao internacional'],
		scopes: ['apostilamento e validacao documental', 'coordenacao com parceiros externos', 'homologacoes e reconhecimentos'],
		themes: [
			{ key: 'apostilamento-haia', label: 'Apostilamento de Haia' },
			{ key: 'homologacao', label: 'Homologacao de Decisoes' },
			{ key: 'heranca-internacional', label: 'Heranca Internacional' },
		],
	},
	{
		id: 'contratos-negocios',
		title: 'Contratos e Negocios',
		areaKey: 'contratos',
		summary: 'Modelagem contratual, prevencao de litigos e conducoes de inadimplemento com seguranca juridica.',
		situations: ['revisao contratual', 'descumprimento de obrigacao', 'negociacao de clausulas criticas'],
		scopes: ['elaboracao e revisao de contratos', 'negociacao e repactuacao', 'estrategia de cobranca e execucao'],
		themes: [
			{ key: 'revisao-contratual', label: 'Revisao Contratual' },
			{ key: 'inadimplemento', label: 'Inadimplemento' },
			{ key: 'responsabilidade-civil', label: 'Responsabilidade Civil' },
		],
	},
	{
		id: 'cobranca-recuperacao',
		title: 'Cobranca e Recuperacao de Credito',
		areaKey: 'cobranca',
		summary: 'Fluxos de cobranca extrajudicial e judicial com criterio tecnico, prova e proporcionalidade.',
		situations: ['credito inadimplido', 'renegociacao estruturada', 'execucao de titulos'],
		scopes: ['roteiro de cobranca documentada', 'estrategia de recuperacao', 'medidas judiciais quando cabiveis'],
		themes: [
			{ key: 'cobranca-extrajudicial', label: 'Cobranca Extrajudicial' },
			{ key: 'execucao', label: 'Execucao' },
			{ key: 'titulo-executivo', label: 'Titulo Executivo' },
		],
	},
	{
		id: 'consumidor-responsabilidade',
		title: 'Consumidor e Responsabilidade',
		areaKey: 'consumidor',
		summary: 'Orientacao e defesa em relacoes de consumo com foco em prova, reparacao e equilibrio contratual.',
		situations: ['falha de servico', 'negativa de cobertura', 'publicidade enganosa'],
		scopes: ['analise de risco e direitos aplicaveis', 'estrategia de resolucao e reparacao', 'atuacao judicial quando necessaria'],
		themes: [
			{ key: 'negativa-cobertura', label: 'Negativa de Cobertura' },
			{ key: 'relacao-consumo', label: 'Relacao de Consumo' },
			{ key: 'dano-moral', label: 'Dano Moral' },
		],
	},
	{
		id: 'compliance-integridade',
		title: 'Compliance e Integridade',
		areaKey: 'compliance',
		summary: 'Politicas, controles e trilhas de conformidade para reduzir risco juridico em operacoes e relacoes.',
		situations: ['ajuste de politicas internas', 'adequacao LGPD', 'governanca de conduta'],
		scopes: ['politicas e protocolos praticos', 'matriz de riscos e controles', 'treinamentos e orientacao de lideranca'],
		themes: [
			{ key: 'lgpd', label: 'LGPD' },
			{ key: 'codigo-conduta', label: 'Codigo de Conduta' },
			{ key: 'canal-denuncia', label: 'Canal de Denuncia' },
		],
	},
	{
		id: 'empresarial-societario',
		title: 'Empresarial e Societario',
		areaKey: 'empresarial',
		summary: 'Estruturacao societaria e contratual para decisoes empresariais com seguranca juridica.',
		situations: ['conflito entre socios', 'reorganizacao societaria', 'governanca de negocio'],
		scopes: ['acordos societarios', 'analise de risco em operacoes', 'suporte em conflitos empresariais'],
		themes: [
			{ key: 'societario', label: 'Societario' },
			{ key: 'governanca', label: 'Governanca' },
			{ key: 'due-diligence', label: 'Due Diligence' },
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
