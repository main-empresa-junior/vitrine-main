import { type ChatMessage, findFaqItem, questionText } from '@/features/assistant/conversation';
import { CONTACT_ANSWER, CONTACT_ID, WELCOME_MESSAGE } from '@/features/assistant/faq';

import { ChatActionLink, type FollowAction } from './ChatActionLink';
import { ChatBubble } from './ChatBubble';
import { ContactCard } from './ContactCard';
import { TypingDots } from './TypingDots';

type ChatMessageItemProps = {
  message: ChatMessage;
  isBusy: boolean;
  isReducedMotion: boolean;
  onFollow: FollowAction;
};

export function ChatMessageItem({
  message,
  isBusy,
  isReducedMotion,
  onFollow,
}: ChatMessageItemProps) {
  switch (message.kind) {
    case 'welcome':
      return (
        <ChatBubble author="orbi">
          <p>{WELCOME_MESSAGE}</p>
        </ChatBubble>
      );
    case 'question':
      return (
        <ChatBubble author="visitor">
          <p>{questionText(message.questionId)}</p>
        </ChatBubble>
      );
    case 'redirect':
      return (
        <ChatBubble author="orbi" orbiPose="wink">
          <p className="flex items-center gap-2">
            {message.notice}
            {!isReducedMotion && <TypingDots />}
          </p>
        </ChatBubble>
      );
    case 'answer':
      if (message.questionId === CONTACT_ID) {
        return (
          <ChatBubble author="orbi">
            <p>{CONTACT_ANSWER}</p>
            <ContactCard isDisabled={isBusy} onFollow={onFollow} />
          </ChatBubble>
        );
      }
      return (
        <ChatBubble author="orbi">
          {findFaqItem(message.questionId)?.answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {findFaqItem(message.questionId)?.actions?.map((action) => (
            <ChatActionLink
              key={action.href}
              action={action}
              isDisabled={isBusy}
              onFollow={onFollow}
            />
          ))}
        </ChatBubble>
      );
  }
}
