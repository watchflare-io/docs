import type { APIContext } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { stripMdx } from '@utils/strip-mdx';

const CHANGELOG_INTRO =
    "Le Hub et l'Agent ont le même numéro de version et sont publiés en même temps. Notes de mise à jour, binaires signés et archives : GitHub Releases. Les notes de version ci-dessous sont en anglais.";

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

    const changelog = await getEntry('docs', 'en/changelog');
    if (changelog) {
        const notes = stripMdx(changelog.body ?? '');
        docs.push({
            id: 'fr/changelog',
            title: 'Changelog',
            description:
                "Historique des versions de Watchflare Hub et de l'Agent : nouvelles fonctionnalités, correctifs, et modifications importantes. Mis à jour à chaque version depuis la v0.27.0.",
            content: `${CHANGELOG_INTRO}\n\n${notes}`.slice(0, 2500),
            url: '/fr/changelog/',
        });
    }

    return new Response(JSON.stringify(docs), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
}
