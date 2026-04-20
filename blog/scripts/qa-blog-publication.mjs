import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');
const registryPath = path.join(srcDir, 'data', 'categories.registry.ts');
const categoryPaginationPath = path.join(srcDir, 'lib', 'category-pagination.ts');
const blogHomeSelectionPath = path.join(srcDir, 'lib', 'blog-home-selection.ts');
const blogCssPath = path.join(srcDir, 'styles', 'blog.css');
const readingCssPath = path.join(srcDir, 'styles', 'reading.css');
const areasDir = path.join(srcDir, 'content', 'areas');
const authorsDir = path.join(srcDir, 'content', 'authors');
const postsDir = path.join(srcDir, 'content', 'blog');

const EXPECTED_CATEGORY_CODES = ['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04', 'CAT-05', 'CAT-06', 'CAT-07', 'CAT-08'];
const REQUIRED_EDITORIAL_EVENTS = [
	'editorial_b1_category_click',
	'editorial_b1_article_click',
	'editorial_b2_s2_click',
	'editorial_b4_site_click',
	'editorial_s2_blog_bridge_click',
	'editorial_s2_site_contact_click',
];
const ACCEPTED_DORMANT_B3_EVENTS = [
	'editorial_b3_s2_final_cta_click',
	'editorial_b3_related_read_click',
];
const FORBIDDEN_B3_TAIL_STRINGS = [
	'Transição para o site',
	'Conheça a área correspondente',
	'Conteúdo informativo. Cada caso exige análise técnica individual.',
	'Responsável pelo conteúdo',
	'Leituras relacionadas da categoria',
];
const FORBIDDEN_PUBLIC_STRINGS = [
	'Artigos mais lidos',
	'mais populares',
	'mais lidos',
	'/blog/categoria/1/',
];

const errors = [];
const warnings = [];
const notes = [];

function readText(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

function exists(filePath) {
	return fs.existsSync(filePath);
}

function relative(filePath) {
	return path.relative(root, filePath).replace(/\\/g, '/');
}

function listFiles(dir, matcher = () => true) {
	if (!exists(dir)) return [];
	const output = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) output.push(...listFiles(fullPath, matcher));
		if (entry.isFile() && matcher(entry.name, fullPath)) output.push(fullPath);
	}
	return output;
}

function normalizeRoute(route) {
	if (!route || route === '/index.html') return '/';
	const withoutQuery = route.split(/[?#]/)[0];
	if (!withoutQuery || withoutQuery === '/') return '/';
	if (/\.[a-zA-Z0-9]+$/.test(withoutQuery)) return withoutQuery;
	return withoutQuery.endsWith('/') ? withoutQuery : `${withoutQuery}/`;
}

function routeFromDistFile(filePath) {
	const relativePath = filePath.slice(distDir.length).replace(/\\/g, '/');
	if (relativePath === '/index.html') return '/';
	return normalizeRoute(relativePath.replace(/\/index\.html$/, '/'));
}

function normalizeText(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

function parseScalarValue(rawValue) {
	const value = rawValue.trim();
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (/^\d+$/.test(value)) return Number(value);
	return value.replace(/^['"]|['"]$/g, '');
}

function parseFrontmatter(filePath) {
	const content = readText(filePath);
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) {
		errors.push(`${relative(filePath)}: frontmatter ausente.`);
		return {};
	}

	const data = {};
	let currentListKey = '';
	for (const line of match[1].split(/\r?\n/)) {
		const listItem = line.match(/^\s+-\s*(.*)$/);
		if (listItem && currentListKey) {
			data[currentListKey].push(parseScalarValue(listItem[1]));
			continue;
		}

		const scalar = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!scalar) continue;
		const [, key, rawValue] = scalar;
		const value = rawValue.trim();
		currentListKey = '';
		if (!value) {
			data[key] = [];
			currentListKey = key;
			continue;
		}
		if (value === '|' || value === '>') continue;
		data[key] = parseScalarValue(value);
	}
	return data;
}

function parseRegistry() {
	const source = readText(registryPath);
	const categories = [];
	const pattern =
		/\{\s*code:\s*'([^']+)'[\s\S]*?canonicalTitle:\s*'([^']+)'[\s\S]*?displayTitle:\s*'([^']+)'[\s\S]*?categorySlug:\s*'([^']+)'[\s\S]*?areaSlug:\s*'([^']+)'/g;
	let match;
	while ((match = pattern.exec(source))) {
		categories.push({
			code: match[1],
			canonicalTitle: match[2],
			displayTitle: match[3],
			categorySlug: match[4],
			areaSlug: match[5],
		});
	}
	if (!categories.length) errors.push('src/data/categories.registry.ts: registry canonico nao foi lido.');
	return categories;
}

function parseCategoryPageSize() {
	const source = readText(categoryPaginationPath);
	const match = source.match(/CATEGORY_PAGE_SIZE\s*=\s*(\d+)/);
	if (!match) {
		errors.push('src/lib/category-pagination.ts: CATEGORY_PAGE_SIZE nao encontrado.');
		return 0;
	}
	return Number(match[1]);
}

function isPublicPost(data) {
	return (
		data.draft === false &&
		data.noindex === false &&
		data.legalReview === 'reviewed' &&
		data.editorialReview === 'reviewed' &&
		Boolean(data.slug) &&
		Boolean(data.publishDate)
	);
}

function readContentState(categories) {
	const categoryByCode = new Map(categories.map((category) => [category.code, category]));
	const areas = listFiles(areasDir, (name) => /\.md$/i.test(name)).map((file) => ({
		file,
		data: parseFrontmatter(file),
	}));
	const authors = listFiles(authorsDir, (name) => /\.md$/i.test(name)).map((file) => ({
		file,
		data: parseFrontmatter(file),
	}));
	const posts = listFiles(postsDir, (name) => /\.(md|mdx)$/i.test(name)).map((file) => ({
		file,
		data: parseFrontmatter(file),
	}));

	const areasByCode = new Map();
	const authorsById = new Map();
	const authorsBySlug = new Map();
	const publicPosts = [];
	const publicCounts = new Map(categories.map((category) => [category.code, 0]));

	for (const area of areas) {
		if (area.data.categoryCode) areasByCode.set(area.data.categoryCode, area);
	}

	for (const author of authors) {
		if (author.data.id) authorsById.set(author.data.id, author);
		if (author.data.slug) authorsBySlug.set(author.data.slug, author);
	}

	for (const post of posts) {
		const { data, file } = post;
		if (data.categoryCode && !categoryByCode.has(data.categoryCode)) {
			errors.push(`${relative(file)}: categoryCode fora do registry canonico: ${data.categoryCode}.`);
		}
		if (data.categoryCode && !areasByCode.has(data.categoryCode)) {
			errors.push(`${relative(file)}: categoria sem area correspondente: ${data.categoryCode}.`);
		}
		if (data.authorId && !authorsById.has(data.authorId)) {
			errors.push(`${relative(file)}: artigo sem autor resolvido: ${data.authorId}.`);
		}
		if (data.canonicalCategory && data.canonicalCategory !== data.categoryCode) {
			errors.push(`${relative(file)}: canonicalCategory diverge de categoryCode.`);
		}
		if (isPublicPost(data)) {
			publicPosts.push(post);
			publicCounts.set(data.categoryCode, (publicCounts.get(data.categoryCode) ?? 0) + 1);
		}
	}

	for (const category of categories) {
		const area = areasByCode.get(category.code);
		if (!area) {
			errors.push(`Categoria ${category.code} sem pagina S2 correspondente.`);
			continue;
		}
		if (area.data.slug !== category.areaSlug) {
			errors.push(`${relative(area.file)}: slug da area diverge do registry (${category.areaSlug}).`);
		}
	}

	return {
		areas,
		authors,
		posts,
		publicPosts,
		publicCounts,
		areasByCode,
		authorsById,
		authorsBySlug,
	};
}

function getDistState() {
	if (!exists(distDir)) {
		errors.push('dist: diretorio ausente. Rode npm run build antes de npm run qa:blog.');
		return { htmlFiles: [], htmlByRoute: new Map(), routes: new Set() };
	}

	const htmlFiles = listFiles(distDir, (name) => /\.html$/i.test(name));
	const htmlByRoute = new Map();
	const routes = new Set();
	for (const file of htmlFiles) {
		const route = routeFromDistFile(file);
		routes.add(route);
		htmlByRoute.set(route, readText(file));
	}
	return { htmlFiles, htmlByRoute, routes };
}

function requireRoute(routes, route, label) {
	if (!routes.has(route)) {
		errors.push(`Rota obrigatoria ausente (${label}): ${route}`);
	}
}

function validateRoutes(categories, content, dist) {
	requireRoute(dist.routes, '/blog/', 'B1');
	for (const category of categories) {
		requireRoute(dist.routes, `/blog/categoria/${category.categorySlug}/`, `B2 ${category.code}`);
		requireRoute(dist.routes, `/areas/${category.areaSlug}/`, `S2 ${category.code}`);
		if (dist.routes.has(`/blog/categoria/${category.categorySlug}/1/`)) {
			errors.push(`B2 gerou duplicata /1 para ${category.categorySlug}.`);
		}
	}

	for (const post of content.publicPosts) {
		requireRoute(dist.routes, `/blog/${post.data.slug}/`, `B3 ${post.data.slug}`);
	}
	for (const author of content.authors) {
		requireRoute(dist.routes, `/blog/autor/${author.data.slug}/`, `B4 ${author.data.slug}`);
	}
}

function validateInternalLinks(dist) {
	const missing = [];
	for (const file of dist.htmlFiles) {
		const html = readText(file);
		for (const match of html.matchAll(/href="(?<href>\/[^"#?]*)/g)) {
			const href = match.groups.href;
			if (!href || href.startsWith('//')) continue;
			if (/\.[a-zA-Z0-9]+$/.test(href)) continue;
			const route = normalizeRoute(href);
			if (!dist.routes.has(route)) {
				missing.push(`${relative(file)} -> ${href}`);
			}
		}
	}
	if (missing.length) {
		errors.push(`Links internos quebrados ou ausentes: ${missing.slice(0, 20).join('; ')}`);
	}
	notes.push(`links internos verificados: ${dist.htmlFiles.length} HTMLs, missing=${missing.length}`);
}

function validateCategoryStates(categories, content, dist, pageSize) {
	for (const category of categories) {
		const route = `/blog/categoria/${category.categorySlug}/`;
		const html = dist.htmlByRoute.get(route) ?? '';
		const normalized = normalizeText(html);
		const count = content.publicCounts.get(category.code) ?? 0;
		const pageCapacity = count > 0 ? pageSize - 1 : pageSize;
		if (count === 0 && !normalized.includes('acervo em preparacao')) {
			errors.push(`${route}: categoria sem acervo nao exibe estado honesto de preparacao.`);
		}
		if (count > 0 && !normalized.includes('artigo')) {
			errors.push(`${route}: categoria com acervo nao exibe contagem publica de artigos.`);
		}
		if (count <= pageCapacity && html.includes('data-link-origin="category-pagination"')) {
			errors.push(`${route}: paginacao aparece sem massa publica suficiente.`);
		}
		if (count > pageCapacity && !html.includes('data-link-origin="category-pagination"')) {
			errors.push(`${route}: paginacao ausente com massa publica suficiente.`);
		}
	}
	notes.push(
		`contagem publica por categoria: ${categories
			.map((category) => `${category.code}=${content.publicCounts.get(category.code) ?? 0}`)
			.join(', ')}`,
	);
}

function validateBlogHome(dist) {
	const html = dist.htmlByRoute.get('/blog/') ?? '';
	for (const label of ['Bloco A', 'Bloco B', 'Bloco C']) {
		if (!html.includes(label)) {
			errors.push(`/blog/: bloco editorial esperado ausente: ${label}.`);
		}
	}
	if (html.includes('data-link-origin="category-pagination"')) {
		errors.push('/blog/: B1 nao deve renderizar paginacao estrutural.');
	}
	if (!html.includes('blog-grid-section') || !html.includes('blog-grid__items')) {
		errors.push('/blog/: classes refinadas da Fase 7 ausentes na grade editorial.');
	}
}

function validateBreadcrumbs(dist) {
	for (const [route, html] of dist.htmlByRoute.entries()) {
		const needsBreadcrumb =
			route.startsWith('/blog/categoria/') || route.startsWith('/blog/autor/') || /^\/blog\/[^/]+\/$/.test(route);
		if (!needsBreadcrumb) continue;
		if (!html.includes('class="breadcrumbs"')) {
			errors.push(`${route}: breadcrumbs ausentes.`);
		}
		if (!html.includes('/blog/')) {
			errors.push(`${route}: breadcrumb sem retorno para B1 /blog/.`);
		}
	}
}

function validateEditorialEvents(dist) {
	const allHtml = [...dist.htmlByRoute.values()].join('\n');
	for (const eventName of REQUIRED_EDITORIAL_EVENTS) {
		const count = (allHtml.match(new RegExp(eventName, 'g')) ?? []).length;
		if (count === 0) {
			errors.push(`Evento critico da Fase 6 ausente no build: ${eventName}.`);
		}
		notes.push(`${eventName}=${count}`);
	}
	for (const eventName of ACCEPTED_DORMANT_B3_EVENTS) {
		const count = (allHtml.match(new RegExp(eventName, 'g')) ?? []).length;
		if (count > 0) {
			errors.push(`Evento antigo de B3 reapareceu no HTML final aceito: ${eventName}.`);
		}
		notes.push(`${eventName}=${count} (dormant no B3 limpo)`);
	}
	if (!allHtml.includes('pavieEditorialDataLayer')) {
		errors.push('Runtime neutro da Fase 6 ausente: pavieEditorialDataLayer.');
	}

	for (const anchor of allHtml.matchAll(/<a\b[^>]*data-analytics-event="([^"]+)"[^>]*>/g)) {
		const tag = anchor[0];
		for (const attr of [
			'data-analytics-surface-origin',
			'data-analytics-surface-target',
			'data-analytics-link-type',
		]) {
			if (!tag.includes(attr)) {
				errors.push(`Evento ${anchor[1]} sem atributo obrigatorio ${attr}.`);
			}
		}
	}
}

function validateForbiddenRegressions(dist) {
	const allHtml = [...dist.htmlByRoute.values()].join('\n');
	for (const forbidden of FORBIDDEN_PUBLIC_STRINGS) {
		if (allHtml.includes(forbidden)) {
			errors.push(`Regressao publica vedada encontrada: ${forbidden}.`);
		}
	}
	if (dist.routes.has('/blog/categoria/')) {
		errors.push('Rota removida foi recriada: /blog/categoria/.');
	}
	if (dist.routes.has('/autor/fabio-pavie/')) {
		errors.push('Rota legada foi recriada: /autor/fabio-pavie/.');
	}
}

function validateAcceptedB3ReadingState(content, dist) {
	for (const post of content.publicPosts) {
		const route = `/blog/${post.data.slug}/`;
		const html = dist.htmlByRoute.get(route) ?? '';
		if (!html.includes('data-b3-reading-clean="true"')) {
			errors.push(`${route}: marcador do B3 limpo ausente.`);
		}
		if (!html.includes('data-b3-sidebar-order="toc-categories-same-category"')) {
			errors.push(`${route}: ordem aceita da sidebar da B3 ausente.`);
		}
		for (const forbidden of FORBIDDEN_B3_TAIL_STRINGS) {
			if (html.includes(forbidden)) {
				errors.push(`${route}: cauda removida da B3 reapareceu: ${forbidden}.`);
			}
		}
		const tocIndex = html.indexOf('data-sidebar-section="toc"');
		const categoriesIndex = html.indexOf('data-sidebar-section="categories"');
		const sameCategoryIndex = html.indexOf('data-sidebar-section="same-category"');
		if (tocIndex === -1 || categoriesIndex === -1 || sameCategoryIndex === -1) {
			errors.push(`${route}: sidebar da B3 deve manter Neste artigo, Categorias e Leituras da mesma categoria.`);
			continue;
		}
		if (!(tocIndex < categoriesIndex && categoriesIndex < sameCategoryIndex)) {
			errors.push(`${route}: ordem da sidebar da B3 diverge do estado aceito.`);
		}
	}
}

function validateVisualStructure() {
	const blogCss = readText(blogCssPath);
	const readingCss = readText(readingCssPath);
	for (const token of ['blog-grid-section', 'category-hero', 'category-final-cta', 'author-hero']) {
		if (!blogCss.includes(token)) {
			errors.push(`src/styles/blog.css: refinamento visual esperado ausente: ${token}.`);
		}
	}
	for (const token of ['reading-hero', 'reading-sidebar', 'reading-panel', 'article-content']) {
		if (!readingCss.includes(token)) {
			errors.push(`src/styles/reading.css: refinamento visual esperado ausente: ${token}.`);
		}
	}
}

function validateB1GovernanceSignal() {
	const source = readText(blogHomeSelectionPath);
	for (const token of [
		'B1_SCORE_WEIGHTS',
		'editorialPriority',
		'areaReturnStrength',
		'categoryCoverageNeed',
		'performanceSupportScore',
	]) {
		if (!source.includes(token)) {
			errors.push(`src/lib/blog-home-selection.ts: sinal de governanca da B1 ausente: ${token}.`);
		}
	}
}

function validateRegistry(categories) {
	const codes = categories.map((category) => category.code);
	const categorySlugs = categories.map((category) => category.categorySlug);
	const areaSlugs = categories.map((category) => category.areaSlug);
	for (const code of EXPECTED_CATEGORY_CODES) {
		if (!codes.includes(code)) errors.push(`Registry canonico sem ${code}.`);
	}
	if (codes.length !== EXPECTED_CATEGORY_CODES.length) {
		errors.push(`Registry canonico tem ${codes.length} categorias; esperado ${EXPECTED_CATEGORY_CODES.length}.`);
	}
	if (new Set(codes).size !== codes.length) errors.push('Registry canonico possui categoryCode duplicado.');
	if (new Set(categorySlugs).size !== categorySlugs.length) errors.push('Registry canonico possui categorySlug duplicado.');
	if (new Set(areaSlugs).size !== areaSlugs.length) errors.push('Registry canonico possui areaSlug duplicado.');
	for (const category of categories) {
		if (category.categorySlug !== category.areaSlug) {
			errors.push(`${category.code}: categorySlug e areaSlug divergentes.`);
		}
	}
}

const categories = parseRegistry();
const pageSize = parseCategoryPageSize();
const content = readContentState(categories);
const dist = getDistState();

validateRegistry(categories);
validateRoutes(categories, content, dist);
validateInternalLinks(dist);
validateCategoryStates(categories, content, dist, pageSize);
validateBlogHome(dist);
validateBreadcrumbs(dist);
validateEditorialEvents(dist);
validateForbiddenRegressions(dist);
validateAcceptedB3ReadingState(content, dist);
validateVisualStructure();
validateB1GovernanceSignal();

for (const warning of warnings) console.warn(`[qa-blog] WARN ${warning}`);
for (const note of notes) console.log(`[qa-blog] ${note}`);

if (errors.length) {
	for (const error of errors) console.error(`[qa-blog] ERROR ${error}`);
	process.exit(1);
}

console.log(`[qa-blog] OK ${categories.length} categorias, ${content.publicPosts.length} posts publicos e ${dist.htmlFiles.length} HTMLs validados.`);
