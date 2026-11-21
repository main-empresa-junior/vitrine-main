import { describe, expect, it } from 'vitest';

import { developerLinkKind, isHttpsUrl } from './developer-link';
import { developerSchema } from './schema';

describe('developerLinkKind', () => {
  it('recognizes GitHub and LinkedIn, including subdomains', () => {
    expect(developerLinkKind('https://github.com/ana')).toBe('github');
    expect(developerLinkKind('https://www.linkedin.com/in/ana')).toBe('linkedin');
    expect(developerLinkKind('https://br.linkedin.com/in/ana')).toBe('linkedin');
  });

  it('treats look-alike and other domains as a generic site', () => {
    expect(developerLinkKind('https://github.com.evil.io/ana')).toBe('other');
    expect(developerLinkKind('https://notgithub.com/ana')).toBe('other');
    expect(developerLinkKind('https://ana.dev')).toBe('other');
  });
});

describe('isHttpsUrl', () => {
  it('accepts only complete https addresses', () => {
    expect(isHttpsUrl('https://ana.dev')).toBe(true);
    expect(isHttpsUrl('http://ana.dev')).toBe(false);
    expect(isHttpsUrl('javascript:alert(1)')).toBe(false);
    expect(isHttpsUrl('github.com/ana')).toBe(false);
    expect(isHttpsUrl('https://localhost')).toBe(false);
    expect(isHttpsUrl('https://ana.dev/a b')).toBe(false);
  });
});

describe('developerSchema', () => {
  it('requires a name and keeps the link optional', () => {
    expect(developerSchema.safeParse({ name: 'Ana', url: '' }).success).toBe(true);
    expect(developerSchema.safeParse({ name: '  ', url: '' }).success).toBe(false);
  });

  it('rejects links without https', () => {
    const result = developerSchema.safeParse({ name: 'Ana', url: 'http://ana.dev' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      'Use o endereço completo, começando com https://.',
    );
  });
});
