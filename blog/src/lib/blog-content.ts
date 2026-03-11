import { getCollection, type CollectionEntry } from 'astro:content';
import { readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const BLOG_CONTENT_DIR = resolve(process.cwd(), 'src', 'content', 'blog');
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);

async function hasContentFiles(directory: string): Promise<boolean> {
	let entries;

	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			return false;
		}
		throw error;
	}

	for (const entry of entries) {
		if (entry.isDirectory()) {
			if (await hasContentFiles(resolve(directory, entry.name))) {
				return true;
			}
			continue;
		}

		if (entry.isFile() && MARKDOWN_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
			return true;
		}
	}

	return false;
}

export async function getBlogEntries(): Promise<CollectionEntry<'blog'>[]> {
	if (!(await hasContentFiles(BLOG_CONTENT_DIR))) {
		return [];
	}

	return getCollection('blog');
}
