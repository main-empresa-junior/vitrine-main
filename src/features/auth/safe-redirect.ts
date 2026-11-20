const DASHBOARD_PATH = '/dashboard';
const URL_BASE = 'http://internal.invalid';

// Só caminhos internos do painel, para o login não virar um redirecionamento aberto.
export function getSafeDashboardPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return DASHBOARD_PATH;
  }
  const url = new URL(next, URL_BASE);
  const isDashboardPath =
    url.origin === URL_BASE &&
    (url.pathname === DASHBOARD_PATH || url.pathname.startsWith(`${DASHBOARD_PATH}/`));
  return isDashboardPath ? `${url.pathname}${url.search}` : DASHBOARD_PATH;
}
