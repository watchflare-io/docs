/**
 * Fetches the latest Watchflare release tag from GitHub at build time.
 * Returns null if the fetch fails or times out.
 */
export async function fetchLatestVersion(): Promise<string | null> {
    if (import.meta.env.DEV) return 'dev';
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
            "https://api.github.com/repos/watchflare-io/watchflare/releases/latest",
            {
                headers: { Accept: "application/vnd.github.v3+json" },
                signal: controller.signal,
            },
        );
        clearTimeout(timer);
        if (res.ok) {
            const { tag_name } = await res.json();
            if (tag_name) return tag_name as string;
        }
    } catch {
        // no version shown if fetch fails or times out
    }
    return null;
}
