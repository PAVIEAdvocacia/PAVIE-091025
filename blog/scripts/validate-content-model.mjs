import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const canonicalPath = path.join(root, 'src/lib/canonical-content.ts');
const decapPath = path.join(root, 'public/admin/config.yml');
const areasDir = path.join(root, 'src/content/areas');
const authorsDir = path.join(root, 'src/content/authors');
const postsDir = path.join(root, 'src/content/blog');

const CONTENT_TYPES = new Set(['cornerstone', 'guide', 'spoke', 'faq', 'checklist', 'case-note', 'institutional']);
const CTA_TYPES = new Set(['area', 'contact', 'article-series', 'document-review']);
const READER_STAGES = new Set(['discover', 'clarify', 'compare', 'decide']);
const REVIEW_STATUSES = new Set(['pending', 'reviewed', 'needs-adjustment']);
const MIGRATION_STATUSES = new Set(['native', 'migrated', 'revised', 'archived', 'redirected']);

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
	for (const line of match[1].split(/\r?\n/)) {
		const scalar = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!scalar) continue;
		const [, key, rawValue] = scalar;
		const value = rawValue.trim();
		if (!value || value === '|' || value === '>') continue;
		data[key] = value.replace(/^['"]|['"]$/g, '');
	}
	return data;
}

function parseCanonicalDefinitions() {
	const source = readText(canonicalPath);
	const definitions = [];
	const pattern = /\{\s*code:\s*'([^']+)'[\s\S]*?slug:\s*'([^']+)'[\s\S]*?label:\s*'([^']+)'/g;
	let match;
	while ((match = pattern.exec(source))) {
		definitions.push({ code: match[1], slug: match[2], label: match[3] });
	}
	if (!definitions.length) errors.push('src/lib/canonical-content.ts: nenhuma categoria canonica encontrada.');
	return definitions;
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

	for (const file of files) {
		const data = parseFrontmatter(file);
		for (const field of ['title', 'canonicalTitle', 'displayTitle', 'slug', 'categoryCode', 'seoTitle', 'description', 'ctaType']) {
			requireField(data, field, file);
		}
		assertAllowed(data, 'ctaType', CTA_TYPES, file);

		if (data.categoryCode) {
			if (byCode.has(data.categoryCode)) {
				errors.push(`${path.relative(root, file)}: categoryCode duplicado com ${path.relative(root, byCode.get(data.categoryCode))}.`);
			}
			byCode.set(data.categoryCode, file);
		}

		if (data.slug) {
			if (bySlug.has(data.slug)) {
				errors.push(`${path.relative(root, file)}: slug duplicado com ${path.relative(root, bySlug.get(data.slug))}.`);
			}
			bySlug.set(data.slug, file);
		}
	}

	for (const definition of definitions) {
		const areaFile = byCode.get(definition.code);
		if (!areaFile) {
			errors.push(`Area institucional ausente para ${definition.code} (${definition.slug}).`);
			continue;
		}
		const data = parseFrontmatter(areaFile);
		if (data.slug !== definition.slug) {
			errors.push(`${path.relative(root, areaFile)}: slug '${data.slug}' diverge do registry '${definition.slug}'.`);
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

function validatePosts(definitions, authors) {
	const categoryCodes = new Set(definitions.map((item) => item.code));
	const files = listContentFiles(postsDir);
	const slugs = new Map();

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
		assertAllowed(data, 'contentType', CONTENT_TYPES, file);
		assertAllowed(data, 'readerStage', READER_STAGES, file);
		assertAllowed(data, 'ctaType', CTA_TYPES, file);
		assertAllowed(data, 'legalReview', REVIEW_STATUSES, file);
		assertAllowed(data, 'editorialReview', REVIEW_STATUSES, file);
		assertAllowed(data, 'migrationStatus', MIGRATION_STATUSES, file);

		if (data.authorId && !authors.ids.has(data.authorId)) {
			errors.push(`${path.relative(root, file)}: authorId sem autor correspondente: ${data.authorId}.`);
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
	}

	if (!files.length) warnings.push('src/content/blog: nenhum post encontrado. Estado permitido como transitorio controlado.');
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

const definitions = parseCanonicalDefinitions();
validateAreas(definitions);
const authors = validateAuthors();
validatePosts(definitions, authors);
validateDecap(definitions);

for (const warning of warnings) console.warn(`[content-model] WARN ${warning}`);

if (errors.length) {
	for (const error of errors) console.error(`[content-model] ERROR ${error}`);
	process.exit(1);
}

console.log(`[content-model] OK ${definitions.length} categorias canonicas validadas.`);
