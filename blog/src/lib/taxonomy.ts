const AREA_CANONICAL_LABELS: Record<string, string> = {
	sucessoes: 'Sucessoes e Inventario',
	familia: 'Familia e Patrimonio',
	imobiliario: 'Imobiliario e Regularizacao',
	internacional: 'Familia Internacional',
	contratos: 'Contratos e Negocios',
	cobranca: 'Cobranca e Recuperacao de Credito',
	consumidor: 'Consumidor e Responsabilidade',
	compliance: 'Compliance e Integridade',
	empresarial: 'Empresarial e Societario',
};

const AREA_ALIASES: Record<string, string> = {
	'planejamento-sucessorio': 'sucessoes',
	'sucessoes-e-patrimonio': 'sucessoes',
	'familia-e-patrimonio': 'familia',
	'direito-imobiliario': 'imobiliario',
	'direito-e-patrimonio': 'familia',
};

function titleize(value: string): string {
	return value
		.replace(/[_-]+/g, ' ')
		.trim()
		.split(/\s+/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function normalizeAreaKey(value: string): string {
	const key = normalizeTaxonomyValue(value);
	return AREA_ALIASES[key] ?? key;
}

export function areaLabel(value: string): string {
	const key = normalizeAreaKey(value);
	return AREA_CANONICAL_LABELS[key] ?? titleize(value);
}

export function areaHref(value: string): string {
	return `/blog/areas/${normalizeAreaKey(value)}/`;
}

export function normalizeTemaKey(value: string): string {
	return normalizeTaxonomyValue(value).replace(/\s+/g, '-');
}

export function temaLabel(value: string): string {
	return titleize(value);
}

export function temaHref(value: string): string {
	return `/blog/temas/${normalizeTemaKey(value)}/`;
}

function normalizeTaxonomyValue(value: string): string {
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
