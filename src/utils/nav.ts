import type { TranslationKey } from '@i18n/utils';

export interface NavItem {
  href: string;  // canonical path without locale prefix, with trailing slash
  label: string;
  labelFr?: string;
  child?: boolean;
}

export interface NavGroup {
  titleKey: TranslationKey;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    titleKey: 'nav.group.getStarted',
    items: [
      { href: '/get-started/introduction/', label: 'Introduction' },
      { href: '/get-started/quickstart/', label: 'Quickstart', labelFr: 'Démarrage rapide' },
      { href: '/get-started/architecture/', label: 'Architecture' },
    ],
  },
  {
    titleKey: 'nav.group.hub',
    items: [
      { href: '/hub/deploy-docker/', label: 'Deploy with Docker', labelFr: 'Déployer avec Docker' },
      { href: '/hub/binary-install/', label: 'Binary install (Linux)', labelFr: 'Installation binaire (Linux)' },
      { href: '/hub/configuration/', label: 'Configuration' },
      { href: '/hub/https/', label: 'HTTPS setup', labelFr: 'Configuration HTTPS' },
      { href: '/hub/reverse-proxy/', label: 'Reverse proxy' },
      { href: '/hub/tls/', label: 'TLS certificates', labelFr: 'Certificats TLS' },
      { href: '/hub/alerts/', label: 'Alerts', labelFr: 'Alertes' },
      { href: '/hub/smtp/', label: 'Email notifications', labelFr: 'Notifications e-mail' },
      { href: '/hub/update/', label: 'Update', labelFr: 'Mettre à jour' },
      { href: '/hub/uninstall/', label: 'Uninstall', labelFr: 'Désinstaller' },
    ],
  },
  {
    titleKey: 'nav.group.agent',
    items: [
      { href: '/agent/overview/', label: 'Overview', labelFr: "Vue d'ensemble" },
      { href: '/agent/install/linux/', label: 'Install on Linux', labelFr: 'Installer sur Linux' },
      { href: '/agent/install/macos/', label: 'Install on macOS', labelFr: 'Installer sur macOS' },
      { href: '/agent/configuration/', label: 'Configuration', labelFr: 'Configuration' },
      { href: '/agent/update/', label: 'Update', labelFr: 'Mettre à jour' },
      { href: '/agent/docker-metrics/', label: 'Docker container metrics', labelFr: 'Métriques Docker' },
      { href: '/agent/uninstall/', label: 'Uninstall', labelFr: 'Désinstaller' },
    ],
  },
  {
    titleKey: 'nav.group.monitoring',
    items: [
      { href: '/monitoring/hosts/', label: 'Hosts & status', labelFr: 'Hôtes & statut' },
      { href: '/monitoring/metrics/', label: 'System metrics', labelFr: 'Métriques système' },
      { href: '/monitoring/packages/', label: 'Package inventory', labelFr: 'Inventaire des paquets' },
      { href: '/monitoring/containers/', label: 'Container metrics', labelFr: 'Métriques conteneurs' },
      { href: '/monitoring/alerts/', label: 'Alerts & notifications', labelFr: 'Alertes & notifications' },
    ],
  },
  {
    titleKey: 'nav.group.reference',
    items: [
      { href: '/reference/hub-env/', label: 'Hub environment variables', labelFr: "Variables d'environnement Hub" },
      { href: '/reference/troubleshooting/', label: 'Troubleshooting', labelFr: 'Dépannage' },
    ],
  },
];

/**
 * Returns the nav with hrefs prefixed for the given locale.
 * EN (default): hrefs unchanged — /get-started/introduction/
 * FR: hrefs prefixed with /fr — /fr/get-started/introduction/
 */
export function getLocalizedNav(locale: string | undefined) {
  const isFr = locale === 'fr';
  const prefix = isFr ? '/fr' : '';
  return nav.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      label: isFr ? (item.labelFr ?? item.label) : item.label,
      href: `${prefix}${item.href}`,
    })),
  }));
}

/** Flat list of all nav items for the given locale (used for prev/next). */
export function getNavFlat(locale: string | undefined) {
  return getLocalizedNav(locale).flatMap((g) => g.items);
}

