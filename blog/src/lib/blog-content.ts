import { getCollection, type CollectionEntry } from 'astro:content';
import { readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const POSTS_CONTENT_DIR = resolve(process.cwd(), 'src', 'content', 'blog');
const AREAS_CONTENT_DIR = resolve(process.cwd(), 'src', 'content', 'areas');
const AUTHORS_CONTENT_DIR = resolve(process.cwd(), 'src', 'content', 'authors');
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

export async function getBlogEntries(): Promise<CollectionEntry<'posts'>[]> {
	if (!(await hasContentFiles(POSTS_CONTENT_DIR))) {
		return [];
	}

	return getCollection('posts');
}

export async function getAreaEntries(): Promise<CollectionEntry<'areas'>[]> {
	if (!(await hasContentFiles(AREAS_CONTENT_DIR))) {
		return [];
	}

	return getCollection('areas');
}

export async function getAuthorEntries(): Promise<CollectionEntry<'authors'>[]> {
	if (!(await hasContentFiles(AUTHORS_CONTENT_DIR))) {
		return [];
	}

	return getCollection('authors');
}
