import { describe, expect, it } from 'vitest';

import { CHAT_TIMING } from '@/lib/motion';

import {
  availableQuestionIds,
  type ConversationAction,
  conversationReducer,
  type ConversationState,
  INITIAL_CONVERSATION,
  isBusy,
  parseStoredConversation,
  toStoredConversation,
  typingDelayMs,
} from './conversation';
import { CONTACT_ID, FAQ } from './faq';

function run(...actions: ConversationAction[]): ConversationState {
  return actions.reduce(conversationReducer, INITIAL_CONVERSATION);
}

const ASK_PROJECTS: ConversationAction = { type: 'ask', questionId: 'projects' };
const ANSWER: ConversationAction = { type: 'answer' };
const REDIRECT: ConversationAction = {
  type: 'startRedirect',
  href: '/#todos',
  notice: 'Redirecionando para Todos os projetos…',
};

describe('conversationReducer', () => {
  it('starts with the welcome message and every question available', () => {
    expect(INITIAL_CONVERSATION.messages).toEqual([{ id: 0, kind: 'welcome' }]);
    expect(availableQuestionIds(INITIAL_CONVERSATION)).toEqual([
      ...FAQ.map((item) => item.id),
      CONTACT_ID,
    ]);
  });

  it('adds the question, waits while typing and then adds the answer', () => {
    const asked = run(ASK_PROJECTS);
    expect(asked.messages.at(-1)).toMatchObject({ kind: 'question', questionId: 'projects' });
    expect(asked.pendingQuestionId).toBe('projects');
    expect(isBusy(asked)).toBe(true);

    const answered = conversationReducer(asked, ANSWER);
    expect(answered.messages.at(-1)).toMatchObject({ kind: 'answer', questionId: 'projects' });
    expect(answered.pendingQuestionId).toBeNull();
    expect(isBusy(answered)).toBe(false);
  });

  it('gives every message a unique id', () => {
    const state = run(ASK_PROJECTS, ANSWER, { type: 'ask', questionId: 'price' }, ANSWER);
    const ids = state.messages.map((message) => message.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hides the question just answered but always keeps contact', () => {
    const afterProjects = run(ASK_PROJECTS, ANSWER);
    expect(availableQuestionIds(afterProjects)).not.toContain('projects');
    expect(availableQuestionIds(afterProjects)).toContain(CONTACT_ID);

    const afterContact = run({ type: 'ask', questionId: CONTACT_ID }, ANSWER);
    expect(availableQuestionIds(afterContact)).toContain(CONTACT_ID);
    expect(availableQuestionIds(afterContact)).toContain('projects');
  });

  it('ignores a second question while Orbi is typing', () => {
    const asked = run(ASK_PROJECTS);
    expect(conversationReducer(asked, { type: 'ask', questionId: 'price' })).toBe(asked);
  });

  it('ignores unknown questions and answers without a question', () => {
    expect(run({ type: 'ask', questionId: 'toString' })).toBe(INITIAL_CONVERSATION);
    expect(run(ANSWER)).toBe(INITIAL_CONVERSATION);
  });

  it('adds one notice per redirect and blocks duplicate clicks', () => {
    const redirecting = run(ASK_PROJECTS, ANSWER, REDIRECT);
    expect(redirecting.redirectingTo).toBe('/#todos');
    expect(redirecting.messages.at(-1)).toMatchObject({
      kind: 'redirect',
      notice: 'Redirecionando para Todos os projetos…',
    });

    expect(conversationReducer(redirecting, REDIRECT)).toBe(redirecting);
    expect(conversationReducer(redirecting, ASK_PROJECTS)).toBe(redirecting);
  });

  it('accepts clicks again once the redirect finishes', () => {
    const finished = run(ASK_PROJECTS, ANSWER, REDIRECT, { type: 'finishRedirect' });
    expect(finished.redirectingTo).toBeNull();
    expect(isBusy(finished)).toBe(false);
    expect(conversationReducer(finished, REDIRECT).messages).toHaveLength(
      finished.messages.length + 1,
    );
  });

  it('does not start a redirect while Orbi is typing', () => {
    const asked = run(ASK_PROJECTS);
    expect(conversationReducer(asked, REDIRECT)).toBe(asked);
  });

  it('restarts with only the welcome message', () => {
    expect(run(ASK_PROJECTS, ANSWER, REDIRECT, { type: 'restart' })).toEqual(INITIAL_CONVERSATION);
  });
});

describe('typingDelayMs', () => {
  it('stays between the minimum and the cap', () => {
    for (const id of [...FAQ.map((item) => item.id), CONTACT_ID]) {
      expect(typingDelayMs(id)).toBeGreaterThanOrEqual(CHAT_TIMING.typingMinMs);
      expect(typingDelayMs(id)).toBeLessThanOrEqual(CHAT_TIMING.typingMaxMs);
    }
  });
});

describe('stored conversation', () => {
  it('round-trips through JSON', () => {
    const state = run(ASK_PROJECTS, ANSWER);
    expect(parseStoredConversation(JSON.stringify(toStoredConversation(state)))).toEqual(state);
  });

  it('settles a pending answer and drops a redirect in progress', () => {
    const typing = toStoredConversation(run(ASK_PROJECTS));
    expect(typing.pendingQuestionId).toBeNull();
    expect(typing.messages.at(-1)).toMatchObject({ kind: 'answer', questionId: 'projects' });

    expect(toStoredConversation(run(ASK_PROJECTS, ANSWER, REDIRECT)).redirectingTo).toBeNull();
  });

  it('starts over when the stored value is missing or invalid', () => {
    expect(parseStoredConversation(null)).toBe(INITIAL_CONVERSATION);
    expect(parseStoredConversation('{')).toBe(INITIAL_CONVERSATION);
    expect(parseStoredConversation('{"messages":"x"}')).toBe(INITIAL_CONVERSATION);
  });
});
