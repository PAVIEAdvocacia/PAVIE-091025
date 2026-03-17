import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const ANALYSIS_DIR = join(ROOT, 'analysis');

const CANONICAL_REQUIRED_FIELDS = [
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
];

const LEGACY_ONLY_FIELDS = [
	'area',
	'publish_date',
	'author',
	'status',
	'funnel_stage',
	'subarea',
	'themes',
	'pain_points',
	'primary_cta',
	'og_image',
	'reading_time',
	'related_articles',
	'seo_title',
];

const LEGACY_AREA_MATRIX = {
	'familia-sucessoes-patrimonio': ['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04'],
	'contratos-obrigacoes-responsabilidade-civil': ['CAT-06'],
	'imobiliario-regularizacao-condominios': ['CAT-05'],
	'consumidor-saude-previdencia': [],
	'compliance-integridade-atuacao-empresarial': [],
};

const UNSUPPORTED_LEGACY_AREAS = Object.entries(LEGACY_AREA_MATRIX)
	.filter(([, targets]) => targets.length === 0)
	.map(([key]) => key);

function readMarkdownFiles(directory) {
	return readdirSync(directory)
		.filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
		.sort();
}

function getFrontmatter(text) {
	const normalized = text.replace(/^\uFEFF/, '');
	const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	return match ? match[1].trim() : '';
}

function parseFrontmatterFields(frontmatter) {
	const fields = {};
	for (const line of frontmatter.split(/\r?\n/)) {
		const match = line.match(/^\uFEFF?([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
		if (!match) continue;
		const [, key, rawValue] = match;
		fields[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
	}
	return fields;
}

function detectContentModel(fields) {
	const canonicalSignals = [
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
	];

	return canonicalSignals.some((field) => field in fields) ? 'canonical' : 'legacy';
}

function classifyRecord(fileName, fields) {
	const legacyArea = fields.area || fields.legacyAreaKey || '';
	const targetCategoryCodes = LEGACY_AREA_MATRIX[legacyArea] ?? [];
	const missingCanonicalFields = CANONICAL_REQUIRED_FIELDS.filter((field) => !(field in fields));
	const legacyOnlyPresent = LEGACY_ONLY_FIELDS.filter((field) => field in fields);
	const contentModel = detectContentModel(fields);
	const cmsCompatible = missingCanonicalFields.length === 0;

	return {
		fileName,
		title: fields.title || fileName,
		contentModel,
		legacyArea,
		targetCategoryCodes,
		approvedCanonicalCorrespondence: targetCategoryCodes.length > 0,
		cmsCompatible,
		missingCanonicalFields,
		legacyOnlyPresent,
		status: fields.status || (fields.draft === 'true' ? 'draft' : ''),
	};
}

function toFileRef(relativePath) {
	return `/C:/dev/PAVIE-091025/blog/${relativePath.replace(/\\/g, '/')}`;
}

function buildAcervoAudit(records) {
	const compatible = records.filter((record) => record.cmsCompatible).length;
	const incompatible = records.length - compatible;
	const unsupportedRecords = records.filter(
		(record) => record.legacyArea && !record.approvedCanonicalCorrespondence,
	);

	return `# Pre-Sprint 2 - Auditoria do Acervo Atual

## Resumo

- Arquivos auditados: ${records.length}
- Compatíveis com o contrato canônico/CMS novo: ${compatible}
- Incompatíveis com o CMS novo: ${incompatible}
- Áreas legadas sem correspondência canônica aprovada presentes no acervo: ${unsupportedRecords.length}

## Resultado por arquivo

| Arquivo | Modelo | Área legada | Correspondência canônica | CMS novo | Observação |
|---|---|---|---|---|---|
${records
	.map((record) => {
		const relativePath = `src/content/blog/${record.fileName}`;
		const fileLink = `[${record.fileName}](${toFileRef(relativePath)})`;
		const targetLabel =
			record.targetCategoryCodes.length > 0 ? record.targetCategoryCodes.join(', ') : 'sem aprovação';
		const cmsLabel = record.cmsCompatible ? 'compatível' : 'incompatível';
		const note = record.cmsCompatible
			? 'apto para edição no CMS novo'
			: `faltam ${record.missingCanonicalFields.length} campos canônicos obrigatórios`;
		return `| ${fileLink} | ${record.contentModel} | ${record.legacyArea || '-'} | ${targetLabel} | ${cmsLabel} | ${note} |`;
	})
	.join('\n')}

## Observações de hardening

- Posts com sinais canônicos já entram no repositório, mas não devem sair para a superfície pública legada antes do Sprint 2.
- O acervo legado continua validando por compatibilidade estrutural, sem ser considerado compatível com o CMS canônico.
- As áreas legadas sem correspondência aprovada seguem exigindo triagem humana antes de qualquer migração.
`;
}

function buildCmsGapReport(records) {
	const incompatible = records.filter((record) => !record.cmsCompatible);
	return `# Pre-Sprint 2 - Relatório de Incompatibilidades entre Posts Legados e CMS Novo

## Regra aplicada

O CMS novo exige os seguintes campos canônicos obrigatórios:

\`${CANONICAL_REQUIRED_FIELDS.join('`, `')}\`

## Incompatibilidades por arquivo

${incompatible
	.map((record) => {
		const relativePath = `src/content/blog/${record.fileName}`;
		const fileLink = `[${record.fileName}](${toFileRef(relativePath)})`;
		const missing = record.missingCanonicalFields.map((field) => `\`${field}\``).join(', ');
		const legacyOnly = record.legacyOnlyPresent.map((field) => `\`${field}\``).join(', ') || 'nenhum';
		return `### ${fileLink}

- Título: ${record.title}
- Área legada: \`${record.legacyArea || 'sem área legada'}\`
- Campos canônicos ausentes: ${missing}
- Campos legados presentes fora do formulário novo: ${legacyOnly}
- Impacto se abrir e salvar no CMS novo sem migração prévia: revisão manual obrigatória antes de publicar.
`;
	})
	.join('\n')}
`;
}

function buildUnsupportedAreasReport(records) {
	const occurrences = UNSUPPORTED_LEGACY_AREAS.map((area) => ({
		area,
		files: records.filter((record) => record.legacyArea === area),
	}));

	return `# Pre-Sprint 2 - Áreas Legadas sem Correspondência Canônica Aprovada

## Áreas bloqueadas

${occurrences
	.map((item) => {
		const files =
			item.files.length > 0
				? item.files
						.map((record) => `[${record.fileName}](${toFileRef(`src/content/blog/${record.fileName}`)})`)
						.join(', ')
				: 'nenhum arquivo atual no acervo principal';
		return `- \`${item.area}\`: ${files}`;
	})
	.join('\n')}

## Efeito

- Essas áreas não possuem categoria canônica aprovada no modelo de 7 categorias.
- Nenhum conteúdo dessas áreas pode ser tratado como migrado para o contrato canônico sem triagem humana explícita.
- Antes do Sprint 2, elas permanecem como passivo de classificação, não como destino canônico aprovado.
`;
}

mkdirSync(ANALYSIS_DIR, { recursive: true });

const records = readMarkdownFiles(BLOG_DIR).map((fileName) => {
	const fullPath = join(BLOG_DIR, fileName);
	const raw = readFileSync(fullPath, 'utf8');
	const frontmatter = getFrontmatter(raw);
	const fields = parseFrontmatterFields(frontmatter);
	return classifyRecord(fileName, fields);
});

writeFileSync(
	join(ANALYSIS_DIR, 'pre-sprint-2-acervo-audit.md'),
	buildAcervoAudit(records),
	'utf8',
);
writeFileSync(
	join(ANALYSIS_DIR, 'pre-sprint-2-cms-gap-report.md'),
	buildCmsGapReport(records),
	'utf8',
);
writeFileSync(
	join(ANALYSIS_DIR, 'pre-sprint-2-unsupported-legacy-areas.md'),
	buildUnsupportedAreasReport(records),
	'utf8',
);

console.log('Pre-Sprint 2 audit reports generated successfully.');
