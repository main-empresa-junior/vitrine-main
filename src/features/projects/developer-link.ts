export type DeveloperLinkKind = 'github' | 'linkedin' | 'other';

export const DEVELOPER_LINK_LABELS: Record<DeveloperLinkKind, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  other: 'site',
};

// Só endereços completos com https e um domínio de verdade, como o banco também exige.
export function isHttpsUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.includes('.');
  } catch {
    return false;
  }
}

function hostMatches(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function developerLinkKind(url: string): DeveloperLinkKind {
  if (!isHttpsUrl(url)) return 'other';
  const { hostname } = new URL(url);
  if (hostMatches(hostname, 'github.com')) return 'github';
  if (hostMatches(hostname, 'linkedin.com')) return 'linkedin';
  return 'other';
}
