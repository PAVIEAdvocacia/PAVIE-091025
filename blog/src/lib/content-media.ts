export function normalizeCmsImagePath(rawValue: unknown): string | undefined {
	if (typeof rawValue !== 'string') return undefined;

	const value = rawValue.trim();
	if (!value) return undefined;
	if (/^https?:\/\//i.test(value)) return value;

	const normalized = value.replace(/\\/g, '/');
	if (normalized.startsWith('/')) return normalized;
	if (normalized.startsWith('blog/public/')) {
		return `/${normalized.replace(/^blog\/public\//, '')}`;
	}
	if (normalized.startsWith('public/')) {
		return `/${normalized.replace(/^public\//, '')}`;
	}

	const uploadsMatch = normalized.match(/(?:^|\/)(uploads\/.+)$/);
	if (uploadsMatch) {
		return `/${uploadsMatch[1]}`;
	}

	return undefined;
}
