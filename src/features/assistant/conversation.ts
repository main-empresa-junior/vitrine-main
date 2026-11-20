import { z } from 'zod';

import { CHAT_TIMING } from '@/lib/motion';

import { CONTACT_ANSWER, CONTACT_ID, CONTACT_QUESTION, FAQ, type FaqItem } from './faq';

const KNOWN_QUESTIONS = new Set([...FAQ.map((item) => item.id), CONTACT_ID]);

const questionIdSchema = z.string().refine((id) => KNOWN_QUESTIONS.has(id));

const chatMessageSchema = z.discriminatedUnion('kind', [
  z.object({ id: z.number(), kind: z.literal('welcome') }),
  z.object({ id: z.number(), kind: z.literal('question'), questionId: questionIdSchema }),
  z.object({ id: z.number(), kind: z.literal('answer'), questionId: questionIdSchema }),
  z.object({ id: z.number(), kind: z.literal('redirect'), notice: z.string() }),
]);

const conversationSchema = z.object({
  messages: z.array(chatMessageSchema).readonly(),
  // Pergunta esperando resposta: é o tempo do "digitando".
  pendingQuestionId: questionIdSchema.nullable(),
  lastAnsweredId: questionIdSchema.nullable(),
  // Destino de um redirecionamento em andamento; enquanto existir, o chat não aceita cliques.
  redirectingTo: z.string().nullable(),
  nextId: z.number().int(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ConversationState = z.infer<typeof conversationSchema>;

export type ConversationAction =
  | { type: 'ask'; questionId: string }
  | { type: 'answer' }
  | { type: 'startRedirect'; href: string; notice: string }
  | { type: 'finishRedirect' }
  | { type: 'restart' };

export const INITIAL_CONVERSATION: ConversationState = {
  messages: [{ id: 0, kind: 'welcome' }],
  pendingQuestionId: null,
  lastAnsweredId: null,
  redirectingTo: null,
  nextId: 1,
};

export function isBusy(state: ConversationState): boolean {
  return state.pendingQuestionId !== null || state.redirectingTo !== null;
}

function append(state: ConversationState, message: ChatMessage): ConversationState {
  return { ...state, messages: [...state.messages, message], nextId: state.nextId + 1 };
}

export function conversationReducer(
  state: ConversationState,
  action: ConversationAction,
): ConversationState {
  switch (action.type) {
    case 'ask': {
      if (isBusy(state) || !KNOWN_QUESTIONS.has(action.questionId)) return state;
      const asked = append(state, {
        id: state.nextId,
        kind: 'question',
        questionId: action.questionId,
      });
      return { ...asked, pendingQuestionId: action.questionId };
    }
    case 'answer': {
      const questionId = state.pendingQuestionId;
      if (questionId === null) return state;
      const answered = append(state, { id: state.nextId, kind: 'answer', questionId });
      return { ...answered, pendingQuestionId: null, lastAnsweredId: questionId };
    }
    case 'startRedirect': {
      if (isBusy(state)) return state;
      const noticed = append(state, { id: state.nextId, kind: 'redirect', notice: action.notice });
      return { ...noticed, redirectingTo: action.href };
    }
    case 'finishRedirect':
      return state.redirectingTo === null ? state : { ...state, redirectingTo: null };
    case 'restart':
      return INITIAL_CONVERSATION;
  }
}

export function findFaqItem(questionId: string): FaqItem | undefined {
  return FAQ.find((item) => item.id === questionId);
}

export function questionText(questionId: string): string {
  return questionId === CONTACT_ID ? CONTACT_QUESTION : (findFaqItem(questionId)?.question ?? '');
}

function answerLength(questionId: string): number {
  if (questionId === CONTACT_ID) return CONTACT_ANSWER.length;
  return findFaqItem(questionId)?.answer.join(' ').length ?? 0;
}

// Respostas longas "demoram" mais para serem digitadas, até um teto.
export function typingDelayMs(questionId: string): number {
  const { typingMsPerChar, typingMinMs, typingMaxMs } = CHAT_TIMING;
  return Math.min(typingMaxMs, Math.max(typingMinMs, answerLength(questionId) * typingMsPerChar));
}

// Perguntas para escolher em seguida: todas, menos a que acabou de ser respondida.
export function availableQuestionIds(state: ConversationState): string[] {
  const questions = FAQ.map((item) => item.id).filter((id) => id !== state.lastAnsweredId);
  return [...questions, CONTACT_ID];
}

// O que fica salvo na aba: uma resposta pendente já entra respondida e nada fica em andamento.
export function toStoredConversation(state: ConversationState): ConversationState {
  const settled = conversationReducer(state, { type: 'answer' });
  return { ...settled, redirectingTo: null };
}

export function parseStoredConversation(raw: string | null): ConversationState {
  if (!raw) return INITIAL_CONVERSATION;
  try {
    const parsed = conversationSchema.safeParse(JSON.parse(raw));
    return parsed.success ? toStoredConversation(parsed.data) : INITIAL_CONVERSATION;
  } catch {
    return INITIAL_CONVERSATION;
  }
}
