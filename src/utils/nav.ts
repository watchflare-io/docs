export interface NavItem {
  href: string;
  label: string;
  child?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    title: "Get Started",
    items: [
      { href: "/get-started/introduction", label: "Introduction" },
      { href: "/get-started/quickstart", label: "Quickstart" },
      { href: "/get-started/architecture", label: "Architecture" },
    ],
  },
  {
    title: "Hub",
    items: [
      { href: "/hub/deploy", label: "Deploy with Docker" },
      { href: "/hub/configuration", label: "Configuration" },
      { href: "/hub/https", label: "HTTPS setup" },
      { href: "/hub/reverse-proxy", label: "Reverse proxy" },
      { href: "/hub/tls", label: "TLS certificates" },
      { href: "/hub/alerts", label: "Alerts" },
      { href: "/hub/smtp", label: "Email notifications" },
      { href: "/hub/update", label: "Updating" },
      { href: "/hub/uninstall", label: "Uninstalling" },
    ],
  },
  {
    title: "Agent",
    items: [
      { href: "/agent/overview", label: "Overview" },
      { href: "/agent/install/linux", label: "Install on Linux" },
      { href: "/agent/install/macos", label: "Install on macOS" },
      { href: "/agent/configuration", label: "Configuration reference" },
      { href: "/agent/update", label: "Updating" },
      { href: "/agent/docker-metrics", label: "Docker container metrics" },
      { href: "/agent/uninstall", label: "Uninstalling" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { href: "/monitoring/hosts", label: "Hosts & status" },
      { href: "/monitoring/metrics", label: "System metrics" },
      { href: "/monitoring/packages", label: "Package inventory" },
      { href: "/monitoring/containers", label: "Container metrics" },
      { href: "/monitoring/alerts", label: "Alerts & notifications" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/reference/hub-env", label: "Hub environment variables" },
      { href: "/reference/agent-config", label: "Agent config (TOML)" },
      { href: "/reference/changelog", label: "Changelog" },
    ],
  },
];

export const navFlat = nav.flatMap((g) => g.items);
