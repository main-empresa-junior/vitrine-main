import { describe, expect, it } from 'vitest';

import { parseSaveNotice, saveNoticeFor } from './save-notice';

describe('save notices', () => {
  it('picks the notice for each save', () => {
    expect(saveNoticeFor(true, false)).toBe('published');
    expect(saveNoticeFor(true, true)).toBe('published');
    expect(saveNoticeFor(false, false)).toBe('created');
    expect(saveNoticeFor(false, true)).toBe('updated');
  });

  it('accepts only known notices from the URL', () => {
    expect(parseSaveNotice('updated')).toBe('updated');
    expect(parseSaveNotice('toString')).toBeNull();
    expect(parseSaveNotice('<script>')).toBeNull();
    expect(parseSaveNotice(null)).toBeNull();
  });
});
