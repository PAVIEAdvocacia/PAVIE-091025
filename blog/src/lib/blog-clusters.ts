import type { BlogPost } from './posts';
import { normalizeTemaKey } from './taxonomy';

export interface BlogClusterDefinition {
	key: string;
	title: string;
	description: string;
	editorialSummary: string;
	typicalSituations: string[];
	suggestedThemes: string[];
	institutionalHref: string;
	contactHref: string;
}

export interface BlogClusterDirectoryItem extends BlogClusterDefinition {
	href: string;
	postCount: number;
	hasPosts: boolean;
	hasThemeRoutes: boolean;
	posts: BlogPost[];
	featuredPost?: BlogPost;
	latestPosts: BlogPost[];
	topThemes: string[];
}

const BLOG_CLUSTER_ALIASES: Record<string, string> = {
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

export const BLOG_CLUSTERS: BlogClusterDefinition[] = [
	{
		key: 'familia-sucessoes-patrimonio',
		title: 'Familia, Sucessoes e Patrimonio',
		description:
			'Leituras para decisões familiares, sucessórias e patrimoniais que pedem clareza, documentação correta e condução serena.',
		editorialSummary:
			'Esta seleção de artigos ajuda a entender impactos em divórcio, guarda, herança, inventário e reorganização patrimonial.',
		typicalSituations: [
			'Divorcio, guarda, alimentos e convivencia.',
			'Inventario, partilha, testamento e planejamento sucessorio.',
			'Bens da familia, patrimonio vulneravel e documentos com elemento internacional.',
		],
		suggestedThemes: ['Divorcio', 'Inventario', 'Partilha', 'Testamento'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'contratos-obrigacoes-responsabilidade-civil',
		title: 'Contratos, Obrigacoes e Responsabilidade Civil',
		description:
			'Conteúdos para compromissos jurídicos, inadimplemento, cobrança, prova de dano e estratégia em conflitos civis.',
		editorialSummary:
			'Esta área reúne leituras sobre descumprimento, reparação, execução e leitura técnica de obrigações jurídicas.',
		typicalSituations: [
			'Revisao, elaboracao e negociacao contratual.',
			'Inadimplemento, cobranca extrajudicial e execucao.',
			'Dano material, dano moral e responsabilidade civil.',
		],
		suggestedThemes: ['Revisao contratual', 'Inadimplemento', 'Execucao', 'Responsabilidade civil'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'imobiliario-regularizacao-condominios',
		title: 'Imobiliario, Regularizacao e Condominios',
		description:
			'Leituras orientadas para imóveis, regularização documental, posse, locação e situações condominiais com impacto patrimonial.',
		editorialSummary:
			'Esta área ajuda a reduzir insegurança em compra, venda, uso e regularização de imóveis.',
		typicalSituations: [
			'Compra e venda, locacao e clausulas criticas.',
			'Regularizacao registral e documental do imovel.',
			'Condominios, posse e conflitos sobre uso da propriedade.',
		],
		suggestedThemes: ['Regularizacao de imovel', 'Locacao', 'Usucapiao', 'Compra e venda'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'consumidor-saude-previdencia',
		title: 'Consumidor, Saude e Previdencia',
		description:
			'Conteúdos para relações de consumo, cobertura de saúde e proteção social quando a situação pede enquadramento técnico.',
		editorialSummary:
			'Esta área ajuda a identificar quando a dúvida já exige uma orientação mais aplicada em consumo, saúde ou benefícios.',
		typicalSituations: [
			'Falha de servico, cobranca indevida e relacao de consumo.',
			'Negativa de cobertura e entraves em demandas de saude.',
			'Beneficios, revisoes e organizacao previdenciaria.',
		],
		suggestedThemes: ['Negativa de cobertura', 'Relacao de consumo', 'Saude', 'Previdencia'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'compliance-integridade-atuacao-empresarial',
		title: 'Compliance, Integridade e Atuacao Empresarial',
		description:
			'Leituras sobre governança, integridade, contratos empresariais e estrutura jurídica de operações com risco organizacional.',
		editorialSummary:
			'Esta área conecta decisão empresarial, controles internos e suporte jurídico institucional.',
		typicalSituations: [
			'Politicas internas, conduta e rotina de compliance.',
			'Governanca, socios e apoio juridico a operacoes empresariais.',
			'Contratos empresariais, controles e prevencao de risco.',
		],
		suggestedThemes: ['LGPD', 'Codigo de conduta', 'Governanca', 'Contratos empresariais'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
];

function normalizeClusterValue(value: string): string {
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

function uniqueThemes(posts: BlogPost[], fallback: string[]): string[] {
	const themes = Array.from(
		new Map(
			posts
				.flatMap((post) => post.temas)
				.map((theme) => [normalizeTemaKey(theme), theme]),
		).values(),
	);
	return (themes.length > 0 ? themes : fallback).slice(0, 4);
}

function hasThemeRoutes(posts: BlogPost[]): boolean {
	return posts.some((post) => post.temas.length > 0);
}

export function resolveBlogClusterKey(value: string): string {
	const normalized = normalizeClusterValue(value);
	return BLOG_CLUSTER_ALIASES[normalized] ?? normalized;
}

export function blogClusterHref(value: string): string {
	return `/blog/areas/${resolveBlogClusterKey(value)}/`;
}

export function getBlogClusterDefinition(value: string): BlogClusterDefinition | undefined {
	const key = resolveBlogClusterKey(value);
	return BLOG_CLUSTERS.find((cluster) => cluster.key === key);
}

export function getBlogClusterForPost(post: BlogPost): BlogClusterDefinition {
	return getBlogClusterDefinition(post.areaKey || post.area) ?? BLOG_CLUSTERS[0];
}

export function buildBlogClusterDirectory(posts: BlogPost[]): BlogClusterDirectoryItem[] {
	return BLOG_CLUSTERS.map((cluster) => {
		const clusterPosts = posts.filter(
			(post) => resolveBlogClusterKey(post.areaKey || post.area) === cluster.key,
		);
		return {
			...cluster,
			href: blogClusterHref(cluster.key),
			postCount: clusterPosts.length,
			hasPosts: clusterPosts.length > 0,
			hasThemeRoutes: hasThemeRoutes(clusterPosts),
			posts: clusterPosts,
			featuredPost: clusterPosts[0],
			latestPosts: clusterPosts.slice(0, 3),
			topThemes: uniqueThemes(clusterPosts, cluster.suggestedThemes),
		};
	});
}

export function getBlogClusterStaticKeys(): string[] {
	return [...new Set([...BLOG_CLUSTERS.map((cluster) => cluster.key), ...Object.keys(BLOG_CLUSTER_ALIASES)])];
}

export function getBlogClusterDirectoryItem(
	posts: BlogPost[],
	value: string,
): BlogClusterDirectoryItem | undefined {
	const key = resolveBlogClusterKey(value);
	return buildBlogClusterDirectory(posts).find((cluster) => cluster.key === key);
}
