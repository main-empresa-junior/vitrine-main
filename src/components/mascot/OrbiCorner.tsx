'use client';

import { type AnimationEvent, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import type { OrbiMood } from '@/components/assistant/useOrbiChat';
import { useReducedMotion } from '@/hooks/useReducedMotion';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mood, setMood] = useState<OrbiMood>('talking');
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

  useEffect(() => {
    if (!isChatOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setIsChatOpen(false);
      helpButtonRef.current?.focus();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isChatOpen]);

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

  function toggleChat() {
    clearTimeout(timerRef.current);
    setAction(null);
    setMood('talking');
    setIsChatOpen((isOpen) => !isOpen);
  }

  function closeChat() {
    setIsChatOpen(false);
    helpButtonRef.current?.focus();
  }

  const attentionHandlers = { onPointerEnter: payAttention, onPointerLeave: resumePlaying };
  const isWaving = isAttentive && !reducedMotion && !isChatOpen;
  const orbiClasses = isChatOpen
    ? cn('talking', mood === 'pointing' && 'pointing')
    : cn(action, isWaving && 'wave');

  return (
    <>
      <div
        className={cn(
          'orbi-mascot pointer-events-none fixed right-2 bottom-20 z-40 h-56 w-56 origin-bottom-right scale-75 sm:right-8 sm:bottom-4 sm:scale-100',
          !isChatOpen && action,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-0 right-0 rounded-field border border-border bg-space-950/90 px-3 py-2 text-small font-semibold whitespace-nowrap text-foreground transition duration-200',
            isAttentive && !isChatOpen ? 'opacity-100' : 'translate-y-1.5 opacity-0',
          )}
        >
          Dúvidas? Fale com o Orbi
        </span>
        <div
          {...attentionHandlers}
          onAnimationEnd={handleAnimationEnd}
          className={cn('orbi pointer-events-auto absolute bottom-0 left-4 z-10 w-24', orbiClasses)}
        >
          <OrbiFigure pose={isChatOpen && mood === 'wink' ? 'wink' : 'default'} />
        </div>
        <button
          ref={helpButtonRef}
          type="button"
          {...attentionHandlers}
          onFocus={payAttention}
          onBlur={resumePlaying}
          onClick={toggleChat}
          aria-expanded={isChatOpen}
          aria-controls={isChatOpen ? CHAT_ID : undefined}
          aria-label="Tirar uma dúvida com o Orbi"
          className="orbi-help pointer-events-auto absolute bottom-3.5 left-32 z-20 flex size-14 items-center justify-center rounded-full bg-brand-gradient font-display text-heading font-bold text-white shadow-glow transition duration-200 hover:scale-110 focus-visible:scale-110"
        >
          ?
        </button>
      </div>
      {isChatOpen && (
        <ChatPanel
          id={CHAT_ID}
          onClose={closeChat}
          onLeaveForSection={() => setIsChatOpen(false)}
          onMoodChange={setMood}
        />
      )}
    </>
  );
}
