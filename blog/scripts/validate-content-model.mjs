import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const canonicalPath = path.join(root, 'src/data/categories.registry.ts');
const decapPath = path.join(root, 'public/admin/config.yml');
const areasDir = path.join(root, 'src/content/areas');
const authorsDir = path.join(root, 'src/content/authors');
const postsDir = path.join(root, 'src/content/blog');

const CONTENT_TYPES = new Set(['cornerstone', 'guide', 'spoke', 'faq', 'checklist', 'case-note', 'institutional']);
const CTA_TYPES = new Set(['area', 'contact', 'article-series', 'document-review']);
const READER_STAGES = new Set(['discover', 'clarify', 'compare', 'decide']);
const REVIEW_STATUSES = new Set(['pending', 'reviewed', 'needs-adjustment']);
const MIGRATION_STATUSES = new Set(['native', 'migrated', 'revised', 'archived', 'redirected']);
const EXPECTED_CATEGORY_CODES = ['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04', 'CAT-05', 'CAT-06', 'CAT-07', 'CAT-08'];

const errors = [];
const warnings = [];

function readText(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

function listContentFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	const output = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) output.push(...listContentFiles(fullPath));
		if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) output.push(fullPath);
	}
	return output;
}

function parseFrontmatter(filePath) {
	const content = readText(filePath);
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) {
		errors.push(`${path.relative(root, filePath)}: frontmatter ausente.`);
		return {};
	}

	const data = {};
	let currentListKey = '';
	for (const line of match[1].split(/\r?\n/)) {
		const listItem = line.match(/^\s+-\s*(.*)$/);
		if (listItem && currentListKey) {
			data[currentListKey].push(listItem[1].trim().replace(/^['"]|['"]$/g, ''));
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
		data[key] = value.replace(/^['"]|['"]$/g, '');
	}
	return data;
}

function normalizeInternalHref(value) {
	return String(value || '').trim().replace(/^\/+|\/+$/g, '');
}

function stripSourceComments(source) {
	return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function listSourceFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	const output = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) output.push(...listSourceFiles(fullPath));
		if (entry.isFile() && /\.(astro|ts|tsx|js|jsx|css)$/i.test(entry.name)) output.push(fullPath);
	}
	return output;
}

function parseCanonicalDefinitions() {
	const source = readText(canonicalPath);
	const definitions = [];
	const pattern =
		/\{\s*code:\s*'([^']+)'[\s\S]*?canonicalTitle:\s*'([^']+)'[\s\S]*?displayTitle:\s*'([^']+)'[\s\S]*?categorySlug:\s*'([^']+)'[\s\S]*?areaSlug:\s*'([^']+)'/g;
	let match;
	while ((match = pattern.exec(source))) {
		definitions.push({
			code: match[1],
			label: match[2],
			displayTitle: match[3],
			slug: match[4],
			areaSlug: match[5],
		});
	}
	if (!definitions.length) errors.push('src/data/categories.registry.ts: nenhuma categoria canonica encontrada.');
	return definitions;
}

function validateCanonicalDefinitions(definitions) {
	const codes = definitions.map((definition) => definition.code);
	const slugs = definitions.map((definition) => definition.slug);
	const missing = EXPECTED_CATEGORY_CODES.filter((code) => !codes.includes(code));
	const unexpected = codes.filter((code) => !EXPECTED_CATEGORY_CODES.includes(code));

	for (const code of missing) {
		errors.push(`src/data/categories.registry.ts: categoria canonica obrigatoria ausente: ${code}.`);
	}
	for (const code of unexpected) {
		errors.push(`src/data/categories.registry.ts: categoria canonica nao homologada: ${code}.`);
	}
	if (codes.length !== EXPECTED_CATEGORY_CODES.length) {
		errors.push(
			`src/data/categories.registry.ts: quantidade de categorias canonicas invalida: ${codes.length}; esperado ${EXPECTED_CATEGORY_CODES.length}.`,
		);
	}

	if (new Set(codes).size !== codes.length) {
		errors.push('src/data/categories.registry.ts: categoryCode duplicado no registry canonico.');
	}
	if (new Set(slugs).size !== slugs.length) {
		errors.push('src/data/categories.registry.ts: slug duplicado no registry canonico.');
	}
	if (definitions.some((definition) => definition.slug !== definition.areaSlug)) {
		errors.push('src/data/categories.registry.ts: categorySlug e areaSlug devem preservar vinculo 1:1.');
	}

	const cat08 = definitions.find((definition) => definition.code === 'CAT-08');
	if (!cat08) {
		errors.push('src/data/categories.registry.ts: CAT-08 ausente no registry canonico.');
	} else {
		if (cat08.slug !== 'direito-do-consumidor-responsabilidade-civil') {
			errors.push(`src/data/categories.registry.ts: slug da CAT-08 divergente: ${cat08.slug}.`);
		}
		if (cat08.label !== 'Direito do Consumidor e Responsabilidade Civil') {
			errors.push(`src/data/categories.registry.ts: label da CAT-08 divergente: ${cat08.label}.`);
		}
		if (cat08.displayTitle !== 'Consumidor e Responsabilidade Civil') {
			errors.push(`src/data/categories.registry.ts: displayTitle da CAT-08 divergente: ${cat08.displayTitle}.`);
		}
	}
}

function requireField(data, field, filePath) {
	if (!data[field]) errors.push(`${path.relative(root, filePath)}: campo obrigatorio ausente: ${field}.`);
}

function assertAllowed(data, field, allowed, filePath) {
	if (data[field] && !allowed.has(data[field])) {
		errors.push(`${path.relative(root, filePath)}: ${field} invalido: ${data[field]}.`);
	}
}

function validateAreas(definitions) {
	const files = listContentFiles(areasDir);
	const byCode = new Map();
	const bySlug = new Map();
	const categoryCodes = new Set(definitions.map((item) => item.code));

	for (const file of files) {
		const data = parseFrontmatter(file);
		for (const field of ['title', 'canonicalTitle', 'displayTitle', 'slug', 'categoryCode', 'seoTitle', 'description', 'ctaType', 'ctaTarget']) {
			requireField(data, field, file);
		}
		assertAllowed(data, 'categoryCode', categoryCodes, file);
		assertAllowed(data, 'ctaType', CTA_TYPES, file);

		if (data.categoryCode) {
			if (byCode.has(data.categoryCode)) {
				errors.push(`${path.relative(root, file)}: categoryCode duplicado com ${path.relative(root, byCode.get(data.categoryCode).file)}.`);
			}
			byCode.set(data.categoryCode, { file, data });
		}

		if (data.slug) {
			if (bySlug.has(data.slug)) {
				errors.push(`${path.relative(root, file)}: slug duplicado com ${path.relative(root, bySlug.get(data.slug).file)}.`);
			}
			bySlug.set(data.slug, { file, data });
		}
	}

	for (const definition of definitions) {
		const areaRecord = byCode.get(definition.code);
		if (!areaRecord) {
			errors.push(`Area institucional ausente para ${definition.code} (${definition.slug}).`);
			continue;
		}
		const { file: areaFile, data } = areaRecord;
		if (data.slug !== definition.slug) {
			errors.push(`${path.relative(root, areaFile)}: slug '${data.slug}' diverge do registry '${definition.slug}'.`);
		}
		if (data.title !== definition.label) {
			errors.push(`${path.relative(root, areaFile)}: title '${data.title}' diverge do registry '${definition.label}'.`);
		}
		if (data.canonicalTitle !== definition.label) {
			errors.push(`${path.relative(root, areaFile)}: canonicalTitle '${data.canonicalTitle}' diverge do registry '${definition.label}'.`);
		}
		if (data.displayTitle !== definition.displayTitle) {
			errors.push(`${path.relative(root, areaFile)}: displayTitle '${data.displayTitle}' diverge do registry '${definition.displayTitle}'.`);
		}
	}

	return { byCode, bySlug };
}

function validateBreadcrumbTerms(definitions) {
	const allowedCategoryLabels = new Set(
		definitions.flatMap((definition) => [definition.label, definition.displayTitle]),
	);
	const categoryTermPattern =
		/(Invent[aá]rios?|Sucess[oõ]es?|Planejamento Patrimonial|Fam[ií]lia|Im[oó]veis?|Cobran[cç]a|Contratos|Tributa[cç][aã]o|Consumidor|Responsabilidade Civil)/i;

	for (const file of listSourceFiles(path.join(root, 'src', 'pages'))) {
		const source = stripSourceComments(readText(file));
		if (!source.includes('breadcrumbs')) continue;

		const labelPattern = /label:\s*['"]([^'"]+)['"]/g;
		let match;
		while ((match = labelPattern.exec(source))) {
			const label = match[1];
			if (categoryTermPattern.test(label) && !allowedCategoryLabels.has(label)) {
				errors.push(
					`${path.relative(root, file)}: breadcrumb usa termo tematico fora do registry canonico: '${label}'.`,
				);
			}
		}
	}
}

function validateHomeCategoryRoutes(definitions, areas) {
	for (const definition of definitions) {
		if (!areas.bySlug.has(definition.slug)) {
			errors.push(
				`src/pages/blog/index.astro: card de categoria geraria rota quebrada para /blog/categoria/${definition.slug}/ porque a area correspondente nao existe.`,
			);
		}
	}
}

function validateAuthors() {
	const files = listContentFiles(authorsDir);
	const ids = new Set();
	const slugs = new Set();

	for (const file of files) {
		const data = parseFrontmatter(file);
		for (const field of ['id', 'name', 'slug', 'shortBio', 'extendedBio', 'oab', 'image', 'imageAlt', 'reviewStatus']) {
			requireField(data, field, file);
		}
		assertAllowed(data, 'reviewStatus', REVIEW_STATUSES, file);
		if (data.id) ids.add(data.id);
		if (data.slug) slugs.add(data.slug);
	}

	return { ids, slugs };
}

function validatePosts(definitions, authors, areas) {
	const categoryCodes = new Set(definitions.map((item) => item.code));
	const definitionByCode = new Map(definitions.map((item) => [item.code, item]));
	const files = listContentFiles(postsDir);
	const slugs = new Map();
	const publishedCountByCategory = new Map();

	for (const file of files) {
		const data = parseFrontmatter(file);
		for (const field of [
			'title',
			'seoTitle',
			'description',
			'excerpt',
			'slug',
			'publishDate',
			'authorId',
			'categoryCode',
			'contentType',
			'readerStage',
			'ctaType',
			'ctaTarget',
			'legalReview',
			'editorialReview',
			'migrationStatus',
		]) {
			requireField(data, field, file);
		}
		assertAllowed(data, 'categoryCode', categoryCodes, file);
		assertAllowed(data, 'canonicalCategory', categoryCodes, file);
		assertAllowed(data, 'contentType', CONTENT_TYPES, file);
		assertAllowed(data, 'readerStage', READER_STAGES, file);
		assertAllowed(data, 'ctaType', CTA_TYPES, file);
		assertAllowed(data, 'legalReview', REVIEW_STATUSES, file);
		assertAllowed(data, 'editorialReview', REVIEW_STATUSES, file);
		assertAllowed(data, 'migrationStatus', MIGRATION_STATUSES, file);

		if (data.authorId && !authors.ids.has(data.authorId)) {
			errors.push(`${path.relative(root, file)}: authorId sem autor correspondente: ${data.authorId}.`);
		}
		if (data.categoryCode && !areas.byCode.has(data.categoryCode)) {
			errors.push(`${path.relative(root, file)}: categoryCode sem AreaRecord correspondente: ${data.categoryCode}.`);
		}
		if (data.canonicalCategory && data.categoryCode && data.canonicalCategory !== data.categoryCode) {
			errors.push(
				`${path.relative(root, file)}: canonicalCategory '${data.canonicalCategory}' diverge de categoryCode '${data.categoryCode}'.`,
			);
		}
		if (data.canonicalCategory && !areas.byCode.has(data.canonicalCategory)) {
			errors.push(`${path.relative(root, file)}: canonicalCategory sem AreaRecord correspondente: ${data.canonicalCategory}.`);
		}
		if (data.slug) {
			if (slugs.has(data.slug)) {
				errors.push(`${path.relative(root, file)}: slug de post duplicado com ${path.relative(root, slugs.get(data.slug))}.`);
			}
			slugs.set(data.slug, file);
		}
		if (data.coverImage && !data.coverImageAlt && !data.coverAlt) {
			errors.push(`${path.relative(root, file)}: coverImage exige coverImageAlt ou coverAlt.`);
		}

		const effectiveCategoryCode = data.canonicalCategory || data.categoryCode;
		const definition = definitionByCode.get(effectiveCategoryCode);
		if (definition) {
			const canonicalAreaHref = `areas/${definition.slug}`;
			if (data.ctaType === 'area' && normalizeInternalHref(data.ctaTarget) !== canonicalAreaHref) {
				errors.push(
					`${path.relative(root, file)}: ctaTarget '${data.ctaTarget}' diverge da area canonica '/${canonicalAreaHref}/'.`,
				);
			}
			if (Array.isArray(data.relatedAreas) && !data.relatedAreas.includes(definition.slug)) {
				errors.push(`${path.relative(root, file)}: relatedAreas deve incluir o slug canonico '${definition.slug}'.`);
			}
		}

		if (data.draft === 'false' && data.noindex === 'false' && effectiveCategoryCode) {
			publishedCountByCategory.set(effectiveCategoryCode, (publishedCountByCategory.get(effectiveCategoryCode) ?? 0) + 1);
		}
	}

	if (!files.length) warnings.push('src/content/blog: nenhum post encontrado. Estado permitido como transitorio controlado.');
	if ((publishedCountByCategory.get('CAT-08') ?? 0) < 5) {
		errors.push('src/content/blog: CAT-08 exige acervo minimo de 5 artigos publicados.');
	}
}

function validateDecap(definitions) {
	const config = readText(decapPath);
	for (const definition of definitions) {
		if (!config.includes(definition.code)) {
			errors.push(`public/admin/config.yml: categoryCode ausente no Decap: ${definition.code}.`);
		}
	}

	for (const value of [...CONTENT_TYPES, ...CTA_TYPES, ...READER_STAGES, ...REVIEW_STATUSES, ...MIGRATION_STATUSES]) {
		if (!config.includes(value)) errors.push(`public/admin/config.yml: opcao canonica ausente: ${value}.`);
	}
}

function validateNoFrontendCat08Hardcode() {
	const frontendDirs = [
		path.join(root, 'src', 'components'),
		path.join(root, 'src', 'layouts'),
		path.join(root, 'src', 'pages'),
	];
	const forbidden = [
		'CAT-08',
		'direito-do-consumidor-responsabilidade-civil',
		'Direito do Consumidor e Responsabilidade Civil',
		'Consumidor e Responsabilidade Civil',
	];

	for (const file of frontendDirs.flatMap((dir) => listSourceFiles(dir))) {
		const source = stripSourceComments(readText(file));
		for (const literal of forbidden) {
			if (source.includes(literal)) {
				errors.push(
					`${path.relative(root, file)}: literal estrutural da CAT-08 encontrado no front-end; resolva pelo registry canonico.`,
				);
			}
		}
	}
}

const definitions = parseCanonicalDefinitions();
validateCanonicalDefinitions(definitions);
const areas = validateAreas(definitions);
const authors = validateAuthors();
validatePosts(definitions, authors, areas);
validateDecap(definitions);
validateBreadcrumbTerms(definitions);
validateHomeCategoryRoutes(definitions, areas);
validateNoFrontendCat08Hardcode();

for (const warning of warnings) console.warn(`[content-model] WARN ${warning}`);

if (errors.length) {
	for (const error of errors) console.error(`[content-model] ERROR ${error}`);
	process.exit(1);
}

console.log(`[content-model] OK ${definitions.length} categorias canonicas validadas.`);
