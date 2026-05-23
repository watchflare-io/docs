import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { stripMdx } from '@utils/strip-mdx';

export async function GET(_ctx: APIContext) {
    const allEntries = await getCollection('docs');
    const docs = allEntries
        .filter(e => e.id.startsWith('fr/'))
        .map(entry => ({
            id: entry.id,
            title: entry.data.title,
            description: entry.data.description,
            content: stripMdx(entry.body ?? '').slice(0, 2500),
            url: `/fr/${entry.id.slice(3)}/`,
        }));
    return new Response(JSON.stringify(docs), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
}
