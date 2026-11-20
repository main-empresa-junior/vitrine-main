'use client';

import { useEffect, useId, useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import { ChatMessageItem } from './ChatMessageItem';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import { type OrbiMood, useOrbiChat } from './useOrbiChat';

import './chat.css';

const CHAT_TITLE = 'Converse com o Orbi';
const SCROLL_MARGIN_PX = 16;

type ChatPanelProps = {
  id: string;
  onClose: () => void;
  onLeaveForSection: () => void;
  onMoodChange: (mood: OrbiMood) => void;
};

export function ChatPanel({ id, onClose, onLeaveForSection, onMoodChange }: ChatPanelProps) {
  const titleId = useId();
  const isReducedMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLOListElement>(null);
  const firstReplyRef = useRef<HTMLButtonElement>(null);
  const chat = useOrbiChat({ isReducedMotion, onMoodChange, onLeaveForSection });
  const { messages, pendingQuestionId } = chat.state;

  useEffect(() => {
    firstReplyRef.current?.focus();
  }, []);

  useEffect(() => {
    // Mostra o começo da mensagem mais nova; as perguntas seguem logo abaixo dela.
    const scroller = scrollerRef.current;
    const newest = historyRef.current?.lastElementChild;
    if (scroller && newest instanceof HTMLElement) {
      scroller.scrollTop = newest.offsetTop - SCROLL_MARGIN_PX;
    }
    // A pergunta escolhida some da lista depois da resposta; o foco volta para as perguntas.
    if (document.activeElement === document.body) firstReplyRef.current?.focus();
  }, [messages.length, pendingQuestionId]);

  return (
    <section
      id={id}
      role="dialog"
      aria-labelledby={titleId}
      className="orbi-chat z-50 flex flex-col rounded-t-panel border border-border bg-background text-foreground shadow-card sm:rounded-panel"
    >
      <header className="flex items-center gap-2 border-b border-border py-2 ps-5 pe-2">
        <h2 id={titleId} className="flex-1 font-display text-body font-bold">
          {CHAT_TITLE}
        </h2>
        <Button
          size="sm"
          variant="ghost"
          aria-label="Fechar chat"
          onClick={onClose}
          className="px-0"
        >
          <Icon name="close" className="size-5" />
        </Button>
      </header>
      <div
        ref={scrollerRef}
        className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4"
      >
        <ol
          ref={historyRef}
          aria-live="polite"
          aria-label="Conversa"
          className="flex flex-col gap-3"
        >
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              isBusy={chat.isBusy}
              isReducedMotion={isReducedMotion}
              onFollow={chat.follow}
            />
          ))}
          {pendingQuestionId !== null && <TypingIndicator />}
        </ol>
        <QuickReplies
          questionIds={chat.questionIds}
          isDisabled={chat.isBusy}
          firstReplyRef={firstReplyRef}
          onAsk={chat.ask}
        />
        <Button
          size="sm"
          variant="ghost"
          aria-disabled={chat.isBusy || undefined}
          onClick={chat.restart}
          className="self-start aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        >
          Recomeçar conversa
        </Button>
      </div>
    </section>
  );
}
