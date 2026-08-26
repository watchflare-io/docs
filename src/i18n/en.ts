const en = {
  // Global nav
  'nav.home': 'Home',
  'nav.guides': 'Guides',
  'nav.changelog': 'Changelog',
  'nav.aria.main': 'Main navigation',
  'nav.aria.github': 'GitHub repository',

  // Sidebar nav group titles
  'nav.group.getStarted': 'Get Started',
  'nav.group.hub': 'Hub',
  'nav.group.agent': 'Agent',
  'nav.group.monitoring': 'Monitoring',
  'nav.group.reference': 'Reference',

  // TOC
  'toc.onThisPage': 'On this page',

  // Sidebar
  'sidebar.aria': 'Documentation sidebar',

  // Doc layout
  'doc.skipToMain': 'Skip to main content',
  'doc.openNav': 'Open navigation',
  'doc.menu': 'Menu',
  'doc.editOnGithub': 'Edit this page on GitHub',
  'doc.lastUpdated': 'Last updated:',
  'doc.prev': '← Previous',
  'doc.next': 'Next →',
  'doc.pageNav': 'Page navigation',

  // Search bar (trigger button)
  'searchbar.label': 'Search documentation',
  'searchbar.placeholder': 'Search',

  // Search palette
  'search.aria': 'Search documentation',
  'search.placeholder': 'Search documentation…',
  'search.quickLinks': 'Quick links',
  'search.hint.navigate': 'navigate',
  'search.hint.open': 'open',
  'search.hint.close': 'close',
  'search.cancel': 'Cancel',
  'search.close': 'Close search',
  'search.empty': 'No results for',
  'search.result': 'result',
  'search.results': 'results',
  'search.resultsLabel': 'Search results',
  'search.of': 'of',

  // Fallback notice
  'doc.fallbackNotice': 'This page is not yet available in your language. You are reading the English version.',

  // Theme toggle
  'theme.toggle': 'Toggle theme',

  // Language selector
  'lang.select': 'Select language',
  'lang.en': 'English',
  'lang.fr': 'Français',
} satisfies Record<string, string>;

export default en;
export type Translations = typeof en;
export type TranslationKey = keyof Translations;
