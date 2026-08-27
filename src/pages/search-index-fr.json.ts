import type { APIContext } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { stripMdx } from '@utils/strip-mdx';

const CHANGELOG_INTRO =
    "Le Hub et l'Agent partagent un seul numéro de version et sont publiés ensemble. Les notes de version complètes, les binaires signés et les archives sont publiés sur GitHub Releases. Pour mettre à jour votre installation, consultez Mettre à jour le Hub ou Mettre à jour l'Agent. Les notes de version ci-dessous sont uniquement disponibles en anglais.";

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
                "Historique complet des versions de Watchflare Hub et de l'Agent : nouvelles fonctionnalités, correctifs, et changements incompatibles. Mis à jour à chaque version depuis la v0.27.0.",
            content: `${CHANGELOG_INTRO}\n\n${notes}`.slice(0, 2500),
            url: '/fr/changelog/',
        });
    }

    return new Response(JSON.stringify(docs), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
}
