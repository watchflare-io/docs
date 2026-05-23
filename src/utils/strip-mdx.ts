export function stripMdx(text: string): string {
    return text
        .replace(/^import\s+.+from\s+['"].+['"];?\s*$/gm, '')
        .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
        .replace(/<[A-Z][^>]*\/>/g, '')
        .replace(/<[A-Z][^>]*>/g, '')
        .replace(/<\/[A-Z][^>]*>/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]+`/g, '')
        .replace(/^\|.+$/gm, '')
        .replace(/^[-*_]{3,}\s*$/gm, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/^\s*>/gm, '')
        .replace(/\{[^}]*\}/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
