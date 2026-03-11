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
		title: 'Família, Sucessões e Patrimônio',
		description:
			'Leituras para decisões familiares, sucessórias e patrimoniais que pedem clareza, documentação correta e condução serena.',
		editorialSummary:
			'Artigos desta área ajudam a entender impactos em divórcio, guarda, herança, inventário e reorganização patrimonial.',
		typicalSituations: [
			'Divórcio, guarda, alimentos e convivência.',
			'Inventário, partilha, testamento e planejamento sucessório.',
			'Bens da família, patrimônio vulnerável e documentos com elemento internacional.',
		],
		suggestedThemes: ['Divórcio', 'Inventário', 'Partilha', 'Testamento'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'contratos-obrigacoes-responsabilidade-civil',
		title: 'Contratos, Obrigações e Responsabilidade Civil',
		description:
			'Conteúdos para compromissos jurídicos, inadimplemento, cobrança, prova de dano e estratégia em conflitos civis.',
		editorialSummary:
			'Artigos desta área organizam leituras sobre descumprimento, reparação, execução e leitura técnica de obrigações jurídicas.',
		typicalSituations: [
			'Revisão, elaboração e negociação contratual.',
			'Inadimplemento, cobrança extrajudicial e execução.',
			'Dano material, dano moral e responsabilidade civil.',
		],
		suggestedThemes: ['Revisão contratual', 'Inadimplemento', 'Execução', 'Responsabilidade civil'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'imobiliario-regularizacao-condominios',
		title: 'Imobiliário, Regularização e Condomínios',
		description:
			'Leitura orientada para imóveis, regularização documental, posse, locação e situações condominiais com impacto patrimonial.',
		editorialSummary:
			'Artigos desta área ajudam a reduzir insegurança em compra, venda, uso e regularização de imóveis.',
		typicalSituations: [
			'Compra e venda, locação e cláusulas críticas.',
			'Regularização registral e documental do imóvel.',
			'Condomínios, posse e conflitos sobre uso da propriedade.',
		],
		suggestedThemes: ['Regularização de imóvel', 'Locação', 'Usucapião', 'Compra e venda'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'consumidor-saude-previdencia',
		title: 'Consumidor, Saúde e Previdência',
		description:
			'Conteúdos para relações de consumo, cobertura de saúde e proteção social quando a situação pede enquadramento técnico.',
		editorialSummary:
			'Artigos desta área ajudam a identificar quando a dúvida já exige orientação mais aplicada em consumo, saúde ou benefícios.',
		typicalSituations: [
			'Falha de serviço, cobrança indevida e relação de consumo.',
			'Negativa de cobertura e entraves em demandas de saúde.',
			'Benefícios, revisões e organização previdenciária.',
		],
		suggestedThemes: ['Negativa de cobertura', 'Relação de consumo', 'Saúde', 'Previdência'],
		institutionalHref: '/areas/',
		contactHref: '/blog/contato/',
	},
	{
		key: 'compliance-integridade-atuacao-empresarial',
		title: 'Compliance, Integridade e Atuação Empresarial',
		description:
			'Leituras sobre governança, integridade, contratos empresariais e estrutura jurídica de operações com risco organizacional.',
		editorialSummary:
			'Artigos desta área conectam decisão empresarial, controles internos e suporte jurídico institucional.',
		typicalSituations: [
			'Políticas internas, conduta e rotina de compliance.',
			'Governança, sócios e apoio jurídico a operações empresariais.',
			'Contratos empresariais, controles e prevenção de risco.',
		],
		suggestedThemes: ['LGPD', 'Código de conduta', 'Governança', 'Contratos empresariais'],
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
	return (
		getBlogClusterDefinition(post.areaKey || post.area) ??
		BLOG_CLUSTERS[0]
	);
}

export function buildBlogClusterDirectory(posts: BlogPost[] = []): BlogClusterDirectoryItem[] {
	const safePosts = Array.isArray(posts) ? posts : [];

	return BLOG_CLUSTERS.map((cluster) => {
		const clusterPosts = safePosts.filter(
			(post) => resolveBlogClusterKey(post.areaKey || post.area) === cluster.key,
		);
		return {
			...cluster,
			href: blogClusterHref(cluster.key),
			postCount: clusterPosts.length,
			hasPosts: clusterPosts.length > 0,
			hasThemeRoutes: hasThemeRoutes(clusterPosts),
			posts: clusterPosts,
			featuredPost: clusterPosts.length > 0 ? clusterPosts[0] : undefined,
			latestPosts: clusterPosts.slice(0, 3),
			topThemes: uniqueThemes(clusterPosts, cluster.suggestedThemes),
		};
	});
}

export function getBlogClusterStaticKeys(): string[] {
	return [...new Set([...BLOG_CLUSTERS.map((cluster) => cluster.key), ...Object.keys(BLOG_CLUSTER_ALIASES)])];
}

export function getBlogClusterDirectoryItem(
	posts: BlogPost[] = [],
	value: string,
): BlogClusterDirectoryItem | undefined {
	const key = resolveBlogClusterKey(value);
	return buildBlogClusterDirectory(posts).find((cluster) => cluster.key === key);
}
