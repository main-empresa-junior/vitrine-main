import { describe, expect, it } from 'vitest';

import {
  formatCountdown,
  inactivityState,
  isSessionTooOld,
  SESSION_LIMITS,
  signedInAtMs,
} from './session-limits';

const LOGIN_SECONDS = 1_800_000_000;
const LOGIN_MS = LOGIN_SECONDS * 1000;

describe('signedInAtMs', () => {
  it('uses the earliest sign-in method and ignores token refreshes', () => {
    const claims = {
      amr: [
        { method: 'token_refresh', timestamp: LOGIN_SECONDS - 500 },
        { method: 'password', timestamp: LOGIN_SECONDS },
        { method: 'totp', timestamp: LOGIN_SECONDS + 60 },
      ],
    };
    expect(signedInAtMs(claims)).toBe(LOGIN_MS);
  });

  it('returns null when the claim is missing or malformed', () => {
    expect(signedInAtMs({})).toBeNull();
    expect(signedInAtMs({ amr: 'password' })).toBeNull();
    expect(signedInAtMs({ amr: [{ method: 'password' }] })).toBeNull();
  });
});

describe('isSessionTooOld', () => {
  const claims = { amr: [{ method: 'password', timestamp: LOGIN_SECONDS }] };

  it('expires exactly 8 hours after the sign-in, whatever the activity', () => {
    expect(isSessionTooOld(claims, LOGIN_MS + SESSION_LIMITS.maxSessionMs - 1)).toBe(false);
    expect(isSessionTooOld(claims, LOGIN_MS + SESSION_LIMITS.maxSessionMs)).toBe(true);
  });

  it('fails closed without the sign-in time', () => {
    expect(isSessionTooOld({}, LOGIN_MS)).toBe(true);
  });
});

describe('inactivityState', () => {
  const lastActivity = 1_000_000;

  it('stays active until the warning window', () => {
    const beforeWarning = lastActivity + SESSION_LIMITS.inactivityMs - SESSION_LIMITS.warningMs - 1;
    expect(inactivityState(lastActivity, beforeWarning)).toEqual({ kind: 'active' });
  });

  it('warns during the last two minutes with the time left', () => {
    const now = lastActivity + SESSION_LIMITS.inactivityMs - 30_000;
    expect(inactivityState(lastActivity, now)).toEqual({ kind: 'warning', remainingMs: 30_000 });
  });

  it('expires after 30 minutes without activity', () => {
    const now = lastActivity + SESSION_LIMITS.inactivityMs;
    expect(inactivityState(lastActivity, now)).toEqual({ kind: 'expired' });
  });
});

describe('formatCountdown', () => {
  it('shows minutes and seconds, rounding up', () => {
    expect(formatCountdown(120_000)).toBe('2:00');
    expect(formatCountdown(61_001)).toBe('1:02');
    expect(formatCountdown(-5)).toBe('0:00');
  });
});
