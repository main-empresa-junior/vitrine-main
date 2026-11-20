'use client';

import { type MouseEvent, useEffect, useReducer, useRef } from 'react';

import {
  availableQuestionIds,
  conversationReducer,
  type ConversationState,
  isBusy,
  parseStoredConversation,
  toStoredConversation,
  typingDelayMs,
} from '@/features/assistant/conversation';
import type { FaqAction } from '@/features/assistant/faq';
import { CHAT_TIMING } from '@/lib/motion';

const STORAGE_KEY = 'orbi-chat';

export type OrbiMood = 'talking' | 'pointing' | 'wink';

type UseOrbiChatOptions = {
  isReducedMotion: boolean;
  onMoodChange: (mood: OrbiMood) => void;
  onLeaveForSection: () => void;
};

type OrbiChat = {
  state: ConversationState;
  questionIds: string[];
  isBusy: boolean;
  ask: (questionId: string) => void;
  follow: (event: MouseEvent<HTMLAnchorElement>, action: FaqAction) => void;
  restart: () => void;
};

function readStored(): ConversationState {
  try {
    return parseStoredConversation(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return parseStoredConversation(null);
  }
}

function opensElsewhere(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

// Seção da própria página quando o destino é uma âncora daqui; senão o link navega normalmente.
function sectionOnThisPage(href: string): HTMLElement | null {
  const url = new URL(href, window.location.href);
  if (!url.hash || url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname) return null;
  return document.getElementById(url.hash.slice(1));
}

export function useOrbiChat({
  isReducedMotion,
  onMoodChange,
  onLeaveForSection,
}: UseOrbiChatOptions): OrbiChat {
  const [state, dispatch] = useReducer(conversationReducer, undefined, readStored);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const passThroughRef = useRef<HTMLAnchorElement | null>(null);
  // Trava síncrona: dois cliques antes da próxima renderização não podem agendar duas vezes.
  const isLockedRef = useRef(false);
  const busy = isBusy(state);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toStoredConversation(state)));
    } catch {
      // Sem armazenamento (modo privado bloqueado): a conversa vale só enquanto o chat existir.
    }
  }, [state]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  function later(callback: () => void, delay: number) {
    timersRef.current.push(setTimeout(callback, delay));
  }

  function ask(questionId: string) {
    if (busy || isLockedRef.current) return;
    dispatch({ type: 'ask', questionId });
    if (isReducedMotion) {
      dispatch({ type: 'answer' });
      return;
    }
    isLockedRef.current = true;
    later(() => {
      isLockedRef.current = false;
      dispatch({ type: 'answer' });
      onMoodChange('pointing');
      later(() => onMoodChange('talking'), CHAT_TIMING.pointingMs);
    }, typingDelayMs(questionId));
  }

  function arrive(anchor: HTMLAnchorElement, href: string) {
    isLockedRef.current = false;
    dispatch({ type: 'finishRedirect' });
    onMoodChange('talking');
    const section = sectionOnThisPage(href);
    if (!section) {
      // O mesmo link é clicado de novo, agora sem aviso, para o Next navegar e a barra de carregamento aparecer.
      passThroughRef.current = anchor;
      anchor.click();
      return;
    }
    onLeaveForSection();
    window.history.pushState(null, '', href);
    section.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
    const titleId = section.getAttribute('aria-labelledby');
    const title = (titleId && document.getElementById(titleId)) || section;
    title.focus({ preventScroll: true });
  }

  function follow(event: MouseEvent<HTMLAnchorElement>, action: FaqAction) {
    if (opensElsewhere(event)) return;
    if (passThroughRef.current === event.currentTarget) {
      passThroughRef.current = null;
      return;
    }
    event.preventDefault();
    if (busy || isLockedRef.current) return;
    isLockedRef.current = true;
    const anchor = event.currentTarget;
    dispatch({ type: 'startRedirect', href: action.href, notice: action.notice });
    onMoodChange('wink');
    const delay = isReducedMotion ? CHAT_TIMING.reducedRedirectMs : CHAT_TIMING.redirectMs;
    later(() => arrive(anchor, action.href), delay);
  }

  function restart() {
    timersRef.current.splice(0).forEach(clearTimeout);
    isLockedRef.current = false;
    dispatch({ type: 'restart' });
    onMoodChange('talking');
  }

  return { state, questionIds: availableQuestionIds(state), isBusy: busy, ask, follow, restart };
}
