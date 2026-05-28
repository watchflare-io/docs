import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://docs.watchflare.io';

// Strip MDX/markdown syntax to extract readable prose
function toPlainText(body: string): string {
  return body
    .replace(/^import\s+.+\n/gm, '')           // import statements
    .replace(/^export\s+.+\n/gm, '')            // export statements
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // JSX components
    .replace(/<[A-Z][^>]*/g, '')                // self-closing JSX
    .replace(/<\/[A-Z][^>]*>/g, '')             // closing JSX
    .replace(/```[\s\S]*?```/g, '')             // fenced code blocks
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1)) // inline code — keep text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')         // headings → plain text
    .replace(/\*\*(.+?)\*\*/g, '$1')            // bold
    .replace(/\*(.+?)\*/g, '$1')                // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links → label only
    .replace(/^\s*\|.+\|\s*$/gm, '')            // table rows
    .replace(/^\s*[-|:]+\s*$/gm, '')            // table separators
    .replace(/^\s*---+\s*$/gm, '')              // hr
    .replace(/\n{3,}/g, '\n\n')                 // collapse blank lines
    .trim();
}

// Ordered section map matching llms.txt structure
const SECTION_ORDER = [
  'en/get-started/',
  'en/hub/',
  'en/agent/',
  'en/monitoring/',
  'en/reference/',
  'en/changelog',
];

function sectionOf(id: string): number {
  for (let i = 0; i < SECTION_ORDER.length; i++) {
    if (id.startsWith(SECTION_ORDER[i]) || id === SECTION_ORDER[i]) return i;
  }
  return 99;
}

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs', (e) => e.id.startsWith('en/'));

  const sorted = [...entries].sort((a, b) => {
    const sa = sectionOf(a.id);
    const sb = sectionOf(b.id);
    if (sa !== sb) return sa - sb;
    return a.id.localeCompare(b.id);
  });

  let output = '# Watchflare Documentation — Full Text\n\n';
  output += '> Complete text of all English documentation pages.\n';
  output += `> Source: ${SITE}/llms.txt\n\n`;

  for (const entry of sorted) {
    const slug = entry.id.slice(3); // strip 'en/'
    const url = `${SITE}/${slug}/`;
    const prose = toPlainText(entry.body ?? '');
    if (!prose) continue;

    output += `## ${entry.data.title}\n`;
    output += `URL: ${url}\n\n`;
    output += prose;
    output += '\n\n---\n\n';
  }

  return new Response(output.trimEnd() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
