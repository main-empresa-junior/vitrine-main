'use client';

import { type AnimationEvent, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useOverlay } from '@/hooks/useOverlay';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CHAT_TIMING } from '@/lib/motion';
import { cn } from '@/lib/utils/cn';

import { type OrbiAction, pickNextAction } from './orbi-actions';
import { OrbiFigure } from './OrbiFigure';

import './orbi.css';

const ChatPanel = dynamic(
  () => import('@/components/assistant/ChatPanel').then((module) => module.ChatPanel),
  { ssr: false },
);

const CHAT_ID = 'orbi-chat';
const FIRST_DELAY_MS = 1800;
const MIN_PAUSE_MS = 900;
const PAUSE_VARIATION_MS = 1400;

export function OrbiCorner() {
  const reducedMotion = useReducedMotion();
  const [action, setAction] = useState<OrbiAction | null>(null);
  const [isAttentive, setIsAttentive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useOverlay('chat');
  const [isPanelMounted, setIsPanelMounted] = useState(false);
  const lastActionRef = useRef<OrbiAction | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  function scheduleNext(delay: number) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = pickNextAction(lastActionRef.current);
      lastActionRef.current = next;
      setAction(next);
    }, delay);
  }

  useEffect(() => {
    if (reducedMotion || isAttentive || isChatOpen) return;
    scheduleNext(FIRST_DELAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [reducedMotion, isAttentive, isChatOpen]);

  // O painel continua montado enquanto esmaece ao fechar.
  if (isChatOpen && !isPanelMounted) setIsPanelMounted(true);

  useEffect(() => {
    if (isChatOpen || !isPanelMounted) return;
    const timer = setTimeout(() => setIsPanelMounted(false), CHAT_TIMING.cornerSwapMs);
    return () => clearTimeout(timer);
  }, [isChatOpen, isPanelMounted]);

  useEffect(() => {
    if (!isChatOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeChat();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  });

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !action) return;
    setAction(null);
    scheduleNext(MIN_PAUSE_MS + Math.random() * PAUSE_VARIATION_MS);
  }

  function payAttention() {
    clearTimeout(timerRef.current);
    setAction(null);
    setIsAttentive(true);
  }

  function resumePlaying() {
    setIsAttentive(false);
  }

  function openChat() {
    clearTimeout(timerRef.current);
    setAction(null);
    setIsAttentive(false);
    setIsChatOpen(true);
  }

  function closeChat() {
    setIsChatOpen(false);
    // O foco só volta ao "?" depois que ele terminou de reaparecer.
    setTimeout(() => helpButtonRef.current?.focus(), CHAT_TIMING.cornerSwapMs);
  }

  const attentionHandlers = { onPointerEnter: payAttention, onPointerLeave: resumePlaying };
  const isWaving = isAttentive && !reducedMotion;

  return (
    <>
      <div
        inert={isChatOpen}
        aria-hidden={isChatOpen || undefined}
        className={cn(
          'orbi-mascot pointer-events-none fixed right-2 bottom-20 z-40 h-56 w-56 origin-bottom-right scale-75 sm:right-8 sm:bottom-4 sm:scale-100',
          action,
        )}
      >
        <div
          className={cn(
            'absolute inset-0 origin-bottom-right transition duration-200 ease-out-soft',
            isChatOpen && 'translate-y-4 scale-90 opacity-0',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-0 right-0 rounded-field border border-border bg-space-950/90 px-3 py-2 text-small font-semibold whitespace-nowrap text-foreground transition duration-200',
              isAttentive ? 'opacity-100' : 'translate-y-1.5 opacity-0',
            )}
          >
            Dúvidas? Fale com o Orbi
          </span>
          <div
            {...attentionHandlers}
            onAnimationEnd={handleAnimationEnd}
            className={cn(
              'orbi absolute bottom-0 left-4 z-10 w-24',
              !isChatOpen && 'pointer-events-auto',
              action,
              isWaving && 'wave',
            )}
          >
            <OrbiFigure />
          </div>
          <button
            ref={helpButtonRef}
            type="button"
            {...attentionHandlers}
            onFocus={payAttention}
            onBlur={resumePlaying}
            onClick={openChat}
            aria-expanded={isChatOpen}
            aria-controls={isChatOpen ? CHAT_ID : undefined}
            aria-label="Tirar uma dúvida com o Orbi"
            className={cn(
              'orbi-help absolute bottom-3.5 left-32 z-20 flex size-14 items-center justify-center rounded-full bg-brand-gradient font-display text-heading font-bold text-white shadow-glow transition duration-200 hover:scale-110 focus-visible:scale-110',
              !isChatOpen && 'pointer-events-auto',
            )}
          >
            ?
          </button>
        </div>
      </div>
      {isPanelMounted && (
        <ChatPanel
          id={CHAT_ID}
          isLeaving={!isChatOpen}
          onClose={closeChat}
          onLeaveForSection={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
