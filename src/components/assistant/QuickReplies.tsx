import type { Ref } from 'react';

import { Button } from '@/components/ui/Button';
import { questionText } from '@/features/assistant/conversation';

type QuickRepliesProps = {
  questionIds: readonly string[];
  isDisabled: boolean;
  firstReplyRef: Ref<HTMLButtonElement>;
  onAsk: (questionId: string) => void;
};

export function QuickReplies({ questionIds, isDisabled, firstReplyRef, onAsk }: QuickRepliesProps) {
  return (
    <ul aria-label="Perguntas" className="flex flex-wrap gap-2">
      {questionIds.map((questionId, index) => (
        <li key={questionId}>
          <Button
            ref={index === 0 ? firstReplyRef : undefined}
            size="sm"
            variant="secondary"
            aria-disabled={isDisabled || undefined}
            onClick={() => onAsk(questionId)}
            className="h-auto py-2 text-left aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
          >
            {questionText(questionId)}
          </Button>
        </li>
      ))}
    </ul>
  );
}
