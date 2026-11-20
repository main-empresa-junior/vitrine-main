import { describe, expect, it } from 'vitest';

import { getSafeDashboardPath } from './safe-redirect';

describe('getSafeDashboardPath', () => {
  it.each([
    ['/dashboard', '/dashboard'],
    ['/dashboard/new', '/dashboard/new'],
    ['/dashboard/abc/edit?tab=1', '/dashboard/abc/edit?tab=1'],
  ])('keeps internal dashboard path %s', (next, expected) => {
    expect(getSafeDashboardPath(next)).toBe(expected);
  });

  it.each([
    undefined,
    null,
    '',
    'https://evil.com/dashboard',
    '//evil.com/dashboard',
    '/\\evil.com',
    '/dashboardevil',
    '/',
    '/projects/x',
    'dashboard',
    '/dashboard/../projects',
  ])('falls back to /dashboard for %s', (next) => {
    expect(getSafeDashboardPath(next)).toBe('/dashboard');
  });
});
